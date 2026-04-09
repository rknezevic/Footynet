namespace Footynet.DTOs;

public class AdminDashboardDto
{
    public int PlayerCount { get; set; }
    public int ClubCount { get; set; }
    public int JobAdCount { get; set; }
    public int PendingClubCount { get; set; }
}

public class PendingClubDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string LeagueName { get; set; } = string.Empty;
}

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class AdminJobAdDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ClubName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string AdStatus { get; set; } = string.Empty;
}
