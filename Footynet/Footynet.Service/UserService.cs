using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Footynet.DTOs;
using Footynet.Exceptions;
using Footynet.Models;
using BCrypt.Net;
using Footynet.Repository.Interfaces;
using Footynet.Service.Email;
using Footynet.Service.Interfaces;
using Microsoft.Extensions.Options;
using Footynet.Localization;

namespace Footynet.Service;

public class UserService : IUserService
{
    private static readonly TimeSpan ConfirmationLifetime = TimeSpan.FromHours(24);
    private static readonly TimeSpan ResendCooldown = TimeSpan.FromSeconds(60);

    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IEmailQueue _emailQueue;
    private readonly AppOptions _appOptions;

    public UserService(IUserRepository userRepository, IJwtService jwtService, IEmailQueue emailQueue, IOptions<AppOptions> appOptions)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _emailQueue = emailQueue;
        _appOptions = appOptions.Value;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new InvalidOperationException(AppMessages.Auth.EmailTaken);

        User user = dto.Role switch
        {
            RoleType.Player => new Player
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                FirstName = dto.FirstName ?? string.Empty,
                LastName = dto.LastName ?? string.Empty,
                Age = dto.Age ?? 0,
                Description = dto.Description ?? string.Empty,
                City = dto.City ?? string.Empty,
                CountyName = dto.County ?? string.Empty,
                PrefeeredFootType = dto.PrefeeredFootType ?? PrefeeredFootType.Right
            },
            RoleType.Club => new Club
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Name = dto.Name ?? string.Empty,
                Description = dto.Description ?? string.Empty,
                City = dto.City ?? string.Empty,
                CountyName = dto.County ?? string.Empty,
                LeagueId = dto.LeagueId ?? Guid.Empty,
                IsApproved = false
            },
            RoleType.Admin => throw new InvalidOperationException(AppMessages.Auth.AdminRegistrationNotAllowed),
            _ => throw new ArgumentException(AppMessages.Auth.InvalidRole)
        };

        user.EmailConfirmed = false;
        user.PreferredLanguage = CurrentLanguage();
        var token = IssueConfirmationToken(user);

        await _userRepository.CreateAsync(user);
        SendConfirmationEmail(user, token);

        // No JWT yet: the account can only be used after the email address is confirmed
        return new AuthResponseDto
        {
            Role = user.Role,
            UserId = user.Id,
            RequiresEmailConfirmation = true
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
            throw new UnauthorizedAccessException(AppMessages.Auth.UnknownEmail);

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException(AppMessages.Auth.WrongPassword);

        if (!user.IsActive)
            throw new UnauthorizedAccessException(AppMessages.Auth.AccountDeactivated);

        if (!user.EmailConfirmed)
            throw new ForbiddenException(AppMessages.Auth.EmailNotConfirmed);

        // Remember the language the user is using, for emails sent to them later
        var language = CurrentLanguage();
        if (user.PreferredLanguage != language)
        {
            user.PreferredLanguage = language;
            await _userRepository.UpdateAsync(user);
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> VerifyEmailAsync(string token)
    {
        var user = string.IsNullOrWhiteSpace(token)
            ? null
            : await _userRepository.GetByEmailConfirmationTokenHashAsync(HashToken(token));

        if (user == null || user.EmailConfirmationExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException(AppMessages.Auth.InvalidConfirmationLink);

        user.EmailConfirmed = true;
        user.EmailConfirmationTokenHash = null;
        user.EmailConfirmationExpiresAt = null;
        await _userRepository.UpdateAsync(user);

        // Confirming the email also signs the user in
        return CreateAuthResponse(user);
    }

    public async Task ResendConfirmationAsync(string email)
    {
        // Always "succeeds" so the endpoint can't be used to find out which emails are registered
        var user = await _userRepository.GetByEmailAsync(email);
        if (user == null || user.EmailConfirmed)
            return;
        if (user.EmailConfirmationSentAt > DateTime.UtcNow - ResendCooldown)
            return;

        var token = IssueConfirmationToken(user);
        await _userRepository.UpdateAsync(user);
        SendConfirmationEmail(user, token);
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _userRepository.GetByEmailAsync(email);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var response = new AuthResponseDto
        {
            Token = _jwtService.GenerateToken(user),
            Role = user.Role,
            UserId = user.Id
        };
        if (user is Club club)
            response.IsApproved = club.IsApproved;
        return response;
    }

    // Generates a new random token, stores only its hash on the user and returns the raw token for the link
    private static string IssueConfirmationToken(User user)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .TrimEnd('=').Replace('+', '-').Replace('/', '_');
        user.EmailConfirmationTokenHash = HashToken(token);
        user.EmailConfirmationExpiresAt = DateTime.UtcNow.Add(ConfirmationLifetime);
        user.EmailConfirmationSentAt = DateTime.UtcNow;
        return token;
    }

    private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token))).ToLowerInvariant();

    private void SendConfirmationEmail(User user, string token)
    {
        var link = $"{_appOptions.FrontendUrl.TrimEnd('/')}/verify-email?token={Uri.EscapeDataString(token)}";
        _emailQueue.Enqueue(EmailTemplates.Verification(user.Email, user.PreferredLanguage, DisplayName(user), link));
    }

    // Set by the request localization middleware from the Accept-Language header the frontend sends
    private static string CurrentLanguage() =>
        CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "en" ? "en" : "hr";

    public static string DisplayName(User user) => user switch
    {
        Player p => p.FirstName,
        Club c => c.Name,
        _ => user.Email
    };
}
