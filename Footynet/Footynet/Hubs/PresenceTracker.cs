using System.Collections.Concurrent;

namespace Footynet.Hubs;

// Counts open SignalR connections per user (one per browser tab). A user with at least one
// connection is "online" and gets new messages in the app, so no email notification is needed.
// In-memory: correct for a single backend instance (with several, this would move to e.g. Redis).
public class PresenceTracker
{
    private readonly ConcurrentDictionary<string, int> _connections = new();

    public void Connected(string userId) => _connections.AddOrUpdate(userId, 1, (_, count) => count + 1);

    public void Disconnected(string userId)
    {
        if (_connections.AddOrUpdate(userId, 0, (_, count) => count - 1) <= 0)
            _connections.TryRemove(new KeyValuePair<string, int>(userId, 0));
    }

    public bool IsOnline(Guid userId) => _connections.TryGetValue(userId.ToString(), out var count) && count > 0;
}
