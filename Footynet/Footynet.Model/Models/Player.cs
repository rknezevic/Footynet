namespace Footynet.Models;

public class Player : User
{
    public override RoleType Role => RoleType.Player;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    // Entered at registration; the age is calculated from it, so it never goes out of date
    public DateOnly? DateOfBirth { get; set; }
    // Age as typed by players who registered before the date of birth existed; only used when DateOfBirth is empty
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string CountyName { get; set; } = string.Empty;
    public PrefeeredFootType PrefeeredFootType { get; set; }
    public AvailabilityStatus Availability { get; set; } = AvailabilityStatus.LookingForClub;

    public ICollection<JobApplication> Applications { get; set; } = [];
    public ICollection<PlayerCareerEntry> CareerEntries { get; set; } = [];
    public ICollection<PlayerPosition> Positions { get; set; } = [];

    public int AgeOn(DateOnly today) => DateOfBirth is { } born ? YearsBetween(born, today) : Age;

    // Full years from a date of birth to a day (the birthday itself counts)
    public static int YearsBetween(DateOnly born, DateOnly today)
    {
        var years = today.Year - born.Year;
        return today < born.AddYears(years) ? years - 1 : years;
    }
}

public enum PrefeeredFootType
{
    Right = 0,
    Left = 1
}
