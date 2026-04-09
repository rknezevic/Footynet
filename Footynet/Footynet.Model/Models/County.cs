namespace Footynet.Models;

public class County
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<League> Leagues { get; set; } = [];
}