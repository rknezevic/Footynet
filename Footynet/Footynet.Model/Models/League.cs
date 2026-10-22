namespace Footynet.Models;

public class League
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    // Competition tier in the Croatian league system (4 = Treća NL, 5–8 = regional/county leagues)
    public int Level { get; set; }
    // Null for leagues spanning several counties (Treća NL, MŽNL, 4. NL)
    public Guid? CountyId { get; set; }

    public County? County { get; set; }
}
