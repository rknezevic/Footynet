namespace Footynet.Models;

public class JobAd
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ClubId { get; set; }
    public PositionType RequiredPosition { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public AdStatusType AdStatus { get; set; }
    public Club Club { get; set; } = null!;
    public ICollection<JobApplication> Applications { get; set; } = [];
}

public enum AdStatusType
{
    Open = 0,
    Closed = 1
}