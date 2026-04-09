namespace Footynet.Models;

public class League
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid CountyId { get; set; }

    public County County { get; set; } = null!;
}