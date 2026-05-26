using Footynet.Models;

namespace Footynet.DTOs;

public class JobAdDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ClubName { get; set; } = string.Empty;
    public string LeagueName { get; set; } = string.Empty;
    public PositionType RequiredPosition { get; set; }
    public string RequiredPositionName => RequiredPosition.ToString();
    public StatusType ApplicationStatus { get; set; }  
    public DateTime CreatedAt { get; set; }
}
