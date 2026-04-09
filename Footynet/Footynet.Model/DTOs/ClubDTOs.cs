namespace Footynet.DTOs;

public class UpdateClubProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public Guid LeagueId { get; set; }
    public Guid CountyId { get; set; }
}

public class ClubProfileDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string LeagueName { get; set; } = string.Empty;
    public string CountyName { get; set; } = string.Empty;
    public Guid LeagueId { get; set; }
    public Guid CountyId { get; set; }
}
