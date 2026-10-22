using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service;
using Footynet.Service.Interfaces;
using Moq;

namespace Footynet.Tests.Services;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IJwtService> _jwtService = new();
    private readonly UserService _service;

    public UserServiceTests()
    {
        _jwtService.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("token");
        _userRepository.Setup(r => r.CreateAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
        _service = new UserService(_userRepository.Object, _jwtService.Object);
    }

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

        var result = await _service.RegisterAsync(new RegisterDto
        {
            Email = "klub@example.com",
            Password = "Lozinka123",
            Role = RoleType.Club,
            Name = "NK Primjer",
            LeagueId = leagueId
        });

        Assert.Equal(RoleType.Club, result.Role);
        Assert.Equal("token", result.Token);
        var created = Assert.IsType<Club>(_userRepository.Invocations
            .Single(i => i.Method.Name == nameof(IUserRepository.CreateAsync)).Arguments[0]);
        Assert.False(created.IsApproved);
        Assert.Equal(leagueId, created.LeagueId);
        Assert.NotEqual("Lozinka123", created.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("Lozinka123", created.PasswordHash));
    }

    [Fact]
    public async Task Login_WrongPassword_Throws()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("igrac@example.com")).ReturnsAsync(new Player
        {
            Email = "igrac@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ispravna")
        });

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginDto { Email = "igrac@example.com", Password = "kriva" }));
    }

    [Fact]
    public async Task Login_DeactivatedUser_Throws()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("igrac@example.com")).ReturnsAsync(new Player
        {
            Email = "igrac@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ispravna"),
            IsActive = false
        });

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginDto { Email = "igrac@example.com", Password = "ispravna" }));
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("igrac@example.com")).ReturnsAsync(new Player
        {
            Id = Guid.NewGuid(),
            Email = "igrac@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ispravna")
        });

        var result = await _service.LoginAsync(new LoginDto { Email = "igrac@example.com", Password = "ispravna" });

        Assert.Equal("token", result.Token);
        Assert.Equal(RoleType.Player, result.Role);
    }
}
