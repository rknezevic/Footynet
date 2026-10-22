using Footynet.Models;

namespace Footynet.DTOs;

public class CreateApplicationDto
{
    public Guid JobAdId { get; set; }
    public string? CoverLetter { get; set; }
}

public class PlayerProfileDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;
    public string County { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PrefeeredFootType PrefeeredFootType { get; set; }
    public PositionType? PrimaryPosition { get; set; }
    public PositionType? SecondaryPosition { get; set; }
    public AvailabilityStatus Availability { get; set; }
    public List<CareerEntryDto> Career { get; set; } = [];

    public static PlayerProfileDto From(Player player) => new()
    {
        Id = player.Id,
        FirstName = player.FirstName,
        LastName = player.LastName,
        Age = player.Age,
        Description = player.Description ?? "",
        PrefeeredFootType = player.PrefeeredFootType,
        City = player.City,
        County = player.CountyName,
        PrimaryPosition = player.PrimaryPosition,
        SecondaryPosition = player.SecondaryPosition,
        Availability = player.Availability,
        Career = player.CareerEntries
            .OrderBy(c => c.SortOrder)
            .Select(c => new CareerEntryDto { ClubName = c.ClubName, FromYear = c.FromYear, ToYear = c.ToYear })
            .ToList()
    };
}

public class CareerEntryDto
{
    public string ClubName { get; set; } = string.Empty;
    public int? FromYear { get; set; }
    public int? ToYear { get; set; }
}

public class UpdatePlayerProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Description { get; set; } = string.Empty;
    public PrefeeredFootType PrefeeredFootType { get; set; }
    public string City { get; set; } = string.Empty;
    public string County { get; set; } = string.Empty;
    public PositionType? PrimaryPosition { get; set; }
    public PositionType? SecondaryPosition { get; set; }
    public AvailabilityStatus Availability { get; set; }
    // Replaces the whole career list, in the given order
    public List<CareerEntryDto> Career { get; set; } = [];
}

// Application as shown to the club, with the applicant's public profile (no email or password data)
public class ClubApplicationDto
{
    public Guid Id { get; set; }
    public Guid JobAdId { get; set; }
    public Guid PlayerId { get; set; }
    public string? CoverLetter { get; set; }
    public StatusType Status { get; set; }
    public DateTime AppliedAt { get; set; }
    public PlayerProfileDto Player { get; set; } = new();
}

public class JobApplicationResponseDto
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid JobAdId { get; set; }
    public DateTime AppliedAt { get; set; }
    public string Status { get; set; } = string.Empty;
}
