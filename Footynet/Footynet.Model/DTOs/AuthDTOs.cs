using Footynet.Models;

namespace Footynet.DTOs;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public RoleType Role { get; set; }

    // Player fields
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? Age { get; set; }
    public string? Description { get; set; }
    public string? City { get; set; }
    public Guid? CountyId { get; set; }
    public PrefeeredFootType? PrefeeredFootType { get; set; }

    // Club fields
    public string? Name { get; set; }
    public Guid? LeagueId { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public RoleType Role { get; set; }
    public Guid UserId { get; set; }
    public bool? IsApproved { get; set; }
}
