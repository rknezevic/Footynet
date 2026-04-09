namespace Footynet.Models;

public class Player : User
{
    public override RoleType Role => RoleType.Player;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string City { get; set; } = string.Empty;

    public Guid? CountyId { get; set; }
    public PrefeeredFootType PrefeeredFootType { get; set; }

    public County County { get; set; } = null!;
    public ICollection<JobApplication> Applications { get; set; } = [];
}

public enum PrefeeredFootType
{
    Right = 0,
    Left = 1
}