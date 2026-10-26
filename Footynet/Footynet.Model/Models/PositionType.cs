namespace Footynet.Models;

// Stored as numbers. The first four keep their original values, so job ads and profiles saved
// before the detailed positions existed map to the closest new position
// (Defender → CenterBack, Midfielder → CentralMidfielder, Forward → Striker). Only ever append new values.
public enum PositionType
{
    Goalkeeper = 0,
    CenterBack = 1,
    CentralMidfielder = 2,
    Striker = 3,
    RightBack = 4,
    LeftBack = 5,
    DefensiveMidfielder = 6,
    AttackingMidfielder = 7,
    RightWinger = 8,
    LeftWinger = 9
}

public static class Positions
{
    // Display order: from the goal outwards, like a team sheet
    public static readonly PositionType[] PitchOrder =
    [
        PositionType.Goalkeeper,
        PositionType.RightBack,
        PositionType.CenterBack,
        PositionType.LeftBack,
        PositionType.DefensiveMidfielder,
        PositionType.CentralMidfielder,
        PositionType.AttackingMidfielder,
        PositionType.RightWinger,
        PositionType.LeftWinger,
        PositionType.Striker,
    ];

    public const int MaxPerPlayer = 4;
}

// One of the positions a player can play (a player has 0..MaxPerPlayer of them)
public class PlayerPosition
{
    public Guid PlayerId { get; set; }
    public PositionType Position { get; set; }
    // The order the player chose; the first one is their main position
    public int SortOrder { get; set; }

    public Player Player { get; set; } = null!;
}
