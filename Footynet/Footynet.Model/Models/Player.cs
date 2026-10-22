namespace Footynet.Models;

public class Player : User
{
    public override RoleType Role => RoleType.Player;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string CountyName { get; set; } = string.Empty;
    public PrefeeredFootType PrefeeredFootType { get; set; }
    public PositionType? PrimaryPosition { get; set; }
    public PositionType? SecondaryPosition { get; set; }
    public AvailabilityStatus Availability { get; set; } = AvailabilityStatus.LookingForClub;

    public ICollection<JobApplication> Applications { get; set; } = [];
    public ICollection<PlayerCareerEntry> CareerEntries { get; set; } = [];
}

public enum PrefeeredFootType
{
    Right = 0,
    Left = 1
}
