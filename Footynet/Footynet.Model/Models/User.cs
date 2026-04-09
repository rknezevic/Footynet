namespace Footynet.Models;

public abstract class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public abstract RoleType Role { get; }
}

public enum RoleType
{
    Player = 0,
    Club = 1,
    Admin = 2
}