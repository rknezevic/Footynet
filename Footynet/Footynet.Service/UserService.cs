using Footynet.DTOs;
using Footynet.Models;
using BCrypt.Net;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

namespace Footynet.Service;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public UserService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Korisnik s ovom email adresom već postoji.");

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
                CountyId = dto.CountyId,
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
                LeagueId = dto.LeagueId ?? Guid.Empty,
                CountyId = dto.CountyId ?? Guid.Empty,
                IsApproved = false
            },
            RoleType.Admin => throw new InvalidOperationException("Admin registration not allowed"),
            _ => throw new ArgumentException("Invalid role")
        };

        await _userRepository.CreateAsync(user);

        var token = _jwtService.GenerateToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            UserId = user.Id
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null)
            throw new UnauthorizedAccessException("User with that email doesn't exist");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Wrong password");

        if (!user.IsActive)
            throw new UnauthorizedAccessException("Account has been deactivated");

        var token = _jwtService.GenerateToken(user);
        var response = new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            UserId = user.Id
        };

        if (user is Club club)
        {
            response.IsApproved = club.IsApproved;
        }

        return response;
    }

    public async Task<User?> GetUserByIdAsync(Guid id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _userRepository.GetByEmailAsync(email);
    }
}