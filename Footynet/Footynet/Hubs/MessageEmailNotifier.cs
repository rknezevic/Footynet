using Footynet.Data;
using Footynet.Service;
using Footynet.Service.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Footynet.Hubs;

// Emails a user about a new message only when they are not in the app, and at most once per
// Throttle window, so an active conversation doesn't flood their inbox.
public class MessageEmailNotifier(PresenceTracker presence, FootynetDbContext context, IEmailQueue emailQueue, IOptions<AppOptions> appOptions)
{
    public static readonly TimeSpan Throttle = TimeSpan.FromMinutes(30);

    public async Task NotifyAsync(Guid receiverId, Guid senderId, string senderName, string content)
    {
        if (presence.IsOnline(receiverId))
            return;

        var receiver = await context.Users.FirstOrDefaultAsync(u => u.Id == receiverId);
        if (receiver == null || !receiver.EmailConfirmed)
            return;
        if (receiver.LastMessageEmailAt > DateTime.UtcNow - Throttle)
            return;

        receiver.LastMessageEmailAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        var link = $"{appOptions.Value.FrontendUrl.TrimEnd('/')}/messages?user={senderId}&name={Uri.EscapeDataString(senderName)}";
        emailQueue.Enqueue(EmailTemplates.NewMessage(
            receiver.Email, receiver.PreferredLanguage, UserService.DisplayName(receiver), senderName, content, link));
    }
}
