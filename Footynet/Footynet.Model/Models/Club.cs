namespace Footynet.Models;

public class Club : User
{
    public override RoleType Role => RoleType.Club;
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public Guid CountyId { get; set; }
    public Guid LeagueId { get; set; }

    public County County { get; set; } = null!;
    public League League { get; set; } = null!;
    public bool IsApproved { get; set; } = true;

    public ICollection<JobAd> JobAds { get; set; } = [];
}
