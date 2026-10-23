using Footynet.Hubs;

namespace Footynet.Tests.Services;

public class PresenceTrackerTests
{
    [Fact]
    public void UserIsOnlineWhileAnyTabIsConnected()
    {
        var tracker = new PresenceTracker();
        var userId = Guid.NewGuid();

        tracker.Connected(userId.ToString());
        tracker.Connected(userId.ToString());
        tracker.Disconnected(userId.ToString());
        Assert.True(tracker.IsOnline(userId));

        tracker.Disconnected(userId.ToString());
        Assert.False(tracker.IsOnline(userId));
    }

    [Fact]
    public void UnknownUserIsOffline()
    {
        Assert.False(new PresenceTracker().IsOnline(Guid.NewGuid()));
    }
}
