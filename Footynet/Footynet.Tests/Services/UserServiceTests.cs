using Footynet.DTOs;
using Footynet.Exceptions;
using Footynet.Localization;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service;
using Footynet.Service.Email;
using Footynet.Service.Interfaces;
using Microsoft.Extensions.Options;
using Moq;

namespace Footynet.Tests.Services;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IJwtService> _jwtService = new();
    private readonly List<EmailMessage> _sentEmails = [];
    private readonly UserService _service;

    public UserServiceTests()
    {
        _jwtService.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("token");
        _userRepository.Setup(r => r.CreateAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
        var emailQueue = new Mock<IEmailQueue>();
        emailQueue.Setup(q => q.Enqueue(It.IsAny<EmailMessage>())).Callback<EmailMessage>(_sentEmails.Add);
        _service = new UserService(_userRepository.Object, _jwtService.Object, emailQueue.Object,
            Options.Create(new AppOptions { FrontendUrl = "https://footynet.test" }));
    }

    private static Player ConfirmedPlayer(string password = "ispravna") => new()
    {
        Id = Guid.NewGuid(),
        Email = "igrac@example.com",
        FirstName = "Ivan",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
        EmailConfirmed = true
    };

    // The raw token is only in the emailed link; pull it back out of the email text
    private string TokenFromLastEmail() =>
        _sentEmails.Last().TextBody.Split("token=")[1].Split('\n')[0].Trim();

    [Fact]
    public async Task Register_ExistingEmail_Throws()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("postoji@example.com"))
            .ReturnsAsync(new Player { Email = "postoji@example.com" });

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.RegisterAsync(new RegisterDto { Email = "postoji@example.com", Password = "x", Role = RoleType.Player }));
    }

    [Fact]
    public async Task Register_Admin_IsNotAllowed()
    {
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.RegisterAsync(new RegisterDto { Email = "a@example.com", Password = "x", Role = RoleType.Admin }));
    }

    [Fact]
    public async Task Register_Club_IsNotApprovedAndPasswordIsHashed()
    {
        var leagueId = Guid.NewGuid();

        await _service.RegisterAsync(new RegisterDto
        {
            Email = "klub@example.com",
            Password = "Lozinka123",
            Role = RoleType.Club,
            Name = "NK Primjer",
            LeagueId = leagueId
        });

        var created = Assert.IsType<Club>(_userRepository.Invocations
            .Single(i => i.Method.Name == nameof(IUserRepository.CreateAsync)).Arguments[0]);
        Assert.False(created.IsApproved);
        Assert.Equal(leagueId, created.LeagueId);
        Assert.NotEqual("Lozinka123", created.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Lozinka123", created.PasswordHash));
    }

    [Fact]
    public async Task Register_RequiresConfirmation_AndSendsEmailWithLink()
    {
        var result = await _service.RegisterAsync(new RegisterDto { Email = "igrac@example.com", Password = "Lozinka123", Role = RoleType.Player, FirstName = "Ivan" });

        Assert.True(result.RequiresEmailConfirmation);
        Assert.Equal(string.Empty, result.Token);
        var email = Assert.Single(_sentEmails);
        Assert.Equal("igrac@example.com", email.To);
        Assert.Contains("https://footynet.test/verify-email?token=", email.TextBody);

        // Only a hash of the token is stored, never the token itself
        var created = (User)_userRepository.Invocations.Single(i => i.Method.Name == nameof(IUserRepository.CreateAsync)).Arguments[0];
        Assert.False(created.EmailConfirmed);
        Assert.NotNull(created.EmailConfirmationTokenHash);
        Assert.NotEqual(TokenFromLastEmail(), created.EmailConfirmationTokenHash);
    }

    [Fact]
    public async Task Login_UnconfirmedEmail_IsForbiddenWithCode()
    {
        var player = ConfirmedPlayer();
        player.EmailConfirmed = false;
        _userRepository.Setup(r => r.GetByEmailAsync(player.Email)).ReturnsAsync(player);

        var ex = await Assert.ThrowsAsync<ForbiddenException>(() =>
            _service.LoginAsync(new LoginDto { Email = player.Email, Password = "ispravna" }));
        Assert.Equal(AppMessages.Auth.EmailNotConfirmed, ex.Message);
    }

    [Fact]
    public async Task VerifyEmail_ValidToken_ConfirmsAndSignsIn()
    {
        Player? created = null;
        _userRepository.Setup(r => r.CreateAsync(It.IsAny<User>())).ReturnsAsync((User u) => { created = (Player)u; return u; });
        await _service.RegisterAsync(new RegisterDto { Email = "igrac@example.com", Password = "Lozinka123", Role = RoleType.Player, FirstName = "Ivan" });
        _userRepository.Setup(r => r.GetByEmailConfirmationTokenHashAsync(created!.EmailConfirmationTokenHash!)).ReturnsAsync(created);

        var result = await _service.VerifyEmailAsync(TokenFromLastEmail());

        Assert.Equal("token", result.Token);
        Assert.True(created!.EmailConfirmed);
        Assert.Null(created.EmailConfirmationTokenHash);
    }

    [Fact]
    public async Task VerifyEmail_ExpiredToken_Throws()
    {
        var player = ConfirmedPlayer();
        player.EmailConfirmed = false;
        player.EmailConfirmationExpiresAt = DateTime.UtcNow.AddMinutes(-1);
        _userRepository.Setup(r => r.GetByEmailConfirmationTokenHashAsync(It.IsAny<string>())).ReturnsAsync(player);

        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.VerifyEmailAsync("bilo-sto"));
        Assert.False(player.EmailConfirmed);
    }

    [Fact]
    public async Task ResendConfirmation_RespectsCooldown()
    {
        var player = ConfirmedPlayer();
        player.EmailConfirmed = false;
        player.EmailConfirmationSentAt = DateTime.UtcNow.AddSeconds(-10);
        _userRepository.Setup(r => r.GetByEmailAsync(player.Email)).ReturnsAsync(player);

        await _service.ResendConfirmationAsync(player.Email);
        Assert.Empty(_sentEmails);

        player.EmailConfirmationSentAt = DateTime.UtcNow.AddMinutes(-2);
        await _service.ResendConfirmationAsync(player.Email);
        Assert.Single(_sentEmails);
    }

    [Fact]
    public async Task ResendConfirmation_UnknownEmail_DoesNothing()
    {
        await _service.ResendConfirmationAsync("nepostoji@example.com");
        Assert.Empty(_sentEmails);
    }

    [Fact]
    public async Task Login_WrongPassword_Throws()
    {
        var player = ConfirmedPlayer();
        _userRepository.Setup(r => r.GetByEmailAsync(player.Email)).ReturnsAsync(player);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginDto { Email = player.Email, Password = "kriva" }));
    }

    [Fact]
    public async Task Login_DeactivatedUser_Throws()
    {
        var player = ConfirmedPlayer();
        player.IsActive = false;
        _userRepository.Setup(r => r.GetByEmailAsync(player.Email)).ReturnsAsync(player);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginDto { Email = player.Email, Password = "ispravna" }));
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        var player = ConfirmedPlayer();
        _userRepository.Setup(r => r.GetByEmailAsync(player.Email)).ReturnsAsync(player);

        var result = await _service.LoginAsync(new LoginDto { Email = player.Email, Password = "ispravna" });

        Assert.Equal("token", result.Token);
        Assert.Equal(RoleType.Player, result.Role);
    }
}
