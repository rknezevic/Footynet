using Footynet.Data.Seed;

namespace Footynet.Tests.Data;

// Guards the seed data: a duplicate ID or a dangling county reference would break the migration
public class LookupSeedTests
{
    [Fact]
    public void ThereAre21Counties()
    {
        Assert.Equal(21, LookupSeed.Counties.Length);
    }

    [Fact]
    public void IdsAreUnique()
    {
        Assert.Equal(LookupSeed.Counties.Length, LookupSeed.Counties.Select(c => c.Id).Distinct().Count());
        Assert.Equal(LookupSeed.Leagues.Length, LookupSeed.Leagues.Select(l => l.Id).Distinct().Count());
    }

    [Fact]
    public void LeagueNamesAreUnique()
    {
        Assert.Equal(LookupSeed.Leagues.Length, LookupSeed.Leagues.Select(l => l.Name).Distinct().Count());
    }

    [Fact]
    public void EveryLeagueCountyExists()
    {
        var countyIds = LookupSeed.Counties.Select(c => c.Id).ToHashSet();

        Assert.All(LookupSeed.Leagues.Where(l => l.CountyId != null),
            l => Assert.Contains(l.CountyId!.Value, countyIds));
    }

    [Fact]
    public void LeagueLevelsAreBetween4And8()
    {
        Assert.All(LookupSeed.Leagues, l => Assert.InRange(l.Level, 4, 8));
    }
}
