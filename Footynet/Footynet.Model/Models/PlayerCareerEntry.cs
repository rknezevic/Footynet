namespace Footynet.Models;

// A club from the player's football history. ClubName is free text on purpose:
// most clubs a player played for won't be registered on the platform.
public class PlayerCareerEntry
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public string ClubName { get; set; } = string.Empty;
    // Years are optional so filling in the history stays quick; ToYear null with FromYear set means "to this day"
    public int? FromYear { get; set; }
    public int? ToYear { get; set; }
    // Keeps the order the player entered the clubs in
    public int SortOrder { get; set; }

    public Player Player { get; set; } = null!;
}

public enum AvailabilityStatus
{
    LookingForClub = 0,
    OpenToOffers = 1,
    NotAvailable = 2
}
