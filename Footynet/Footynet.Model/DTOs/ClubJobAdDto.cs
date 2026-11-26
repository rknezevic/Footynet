namespace Footynet.DTOs;

public class ClubJobAdDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RequiredPosition { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string AdStatus { get; set; } = string.Empty;
    // Applications that were not cancelled, and how many of them still wait for an answer
    public int ApplicationCount { get; set; }
    public int PendingApplicationCount { get; set; }
}
