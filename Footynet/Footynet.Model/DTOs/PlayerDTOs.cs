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
}
