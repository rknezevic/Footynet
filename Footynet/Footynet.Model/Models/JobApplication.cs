namespace Footynet.Models;

public class JobApplication
{
    public Guid Id { get; set; }
    public Guid PlayerId { get; set; }
    public Guid JobAdId { get; set; } 
    public string? CoverLetter { get; set; }
    public DateTime AppliedAt { get; set; }
    public StatusType Status { get; set; }
    public Player Player { get; set; } = null!;
    public JobAd JobAd { get; set; } = null!;
}

public enum StatusType
{
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Cancelled = 3
}