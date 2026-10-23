using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Footynet.Hubs;

// Real-time channel for messages. Clients only listen here; sending still goes through
// POST /api/Message (validation + saving), which then pushes the saved message to both users.
// SignalR identifies each connection by the JWT's NameIdentifier claim, so Clients.User(id)
// reaches every open tab/device of that user.
[Authorize]
public class ChatHub(PresenceTracker presence) : Hub
{
    public const string Path = "/hubs/chat";

    // Server -> client event names (the frontend subscribes with connection.on(...))
    public const string ReceiveMessage = "ReceiveMessage";
    public const string MessagesRead = "MessagesRead";

    public override Task OnConnectedAsync()
    {
        if (Context.UserIdentifier != null) presence.Connected(Context.UserIdentifier);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        if (Context.UserIdentifier != null) presence.Disconnected(Context.UserIdentifier);
        return base.OnDisconnectedAsync(exception);
    }
}
