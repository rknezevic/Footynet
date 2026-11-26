using System.Data;
using Dapper;
using Footynet.Data;
using Footynet.Localization;
using Footynet.Model;
using Footynet.Models;
using Footynet.Service;
using Footynet.Service.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Footynet.Email;

// Configuration section "MessageEmails"; the defaults are what production uses
public class MessageEmailOptions
{
    // A message still unread after this long gets an email
    public TimeSpan Delay { get; set; } = TimeSpan.FromMinutes(5);
    // At most one message email per user in this window; messages arriving meanwhile go into the next one
    public TimeSpan Throttle { get; set; } = TimeSpan.FromMinutes(15);
    // How often unread messages are checked
    public TimeSpan Interval { get; set; } = TimeSpan.FromMinutes(1);
    // Older unread messages never trigger an email (e.g. after someone turns the emails back on)
    public TimeSpan MaxAge { get; set; } = TimeSpan.FromDays(1);
}

// Emails users about messages they haven't read. Runs every Interval: claims the messages that have been
// unread for Delay and not emailed yet, then sends each receiver one email for all of them.
// The claim is a single UPDATE ... RETURNING, so a message is emailed about once even if several backend
// instances run this at the same time.
public class UnreadMessageEmailService(
    IServiceScopeFactory scopes,
    IEmailQueue emailQueue,
    IOptions<MessageEmailOptions> options,
    IOptions<AppOptions> appOptions,
    ILogger<UnreadMessageEmailService> logger) : BackgroundService
{
    private const string ClaimSql = @"
        UPDATE ""Messages"" m SET ""EmailNotifiedAt"" = @now
        FROM ""Users"" r
        WHERE m.""ReceiverId"" = r.""Id""
          AND m.""IsRead"" = false
          AND m.""EmailNotifiedAt"" IS NULL
          AND m.""SentAt"" <= @unreadSince
          AND m.""SentAt"" >= @oldest
          AND r.""IsActive"" AND r.""EmailConfirmed"" AND r.""MessageEmailsEnabled""
          AND (r.""LastMessageEmailAt"" IS NULL OR r.""LastMessageEmailAt"" <= @throttledBefore)
        RETURNING m.""ReceiverId"", m.""SenderId"", m.""Content"", m.""SentAt""";

    public record ClaimedMessage(Guid ReceiverId, Guid SenderId, string Content, DateTime SentAt);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(options.Value.Interval);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await SendDueEmailsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                // One failed run (e.g. the database briefly unreachable) must not stop the next ones
                logger.LogError(ex, "Sending unread message emails failed");
            }
        }
    }

    public async Task SendDueEmailsAsync(CancellationToken cancellationToken)
    {
        using var scope = scopes.CreateScope();
        var connection = scope.ServiceProvider.GetRequiredService<IDbConnection>();
        var context = scope.ServiceProvider.GetRequiredService<FootynetDbContext>();
        var o = options.Value;
        var now = DateTime.UtcNow;

        var claimed = (await connection.QueryAsync<ClaimedMessage>(ClaimSql, new
        {
            now,
            unreadSince = now - o.Delay,
            oldest = now - o.MaxAge,
            throttledBefore = now - o.Throttle
        })).ToList();
        if (claimed.Count == 0)
            return;

        var userIds = claimed.SelectMany(m => new[] { m.ReceiverId, m.SenderId }).Distinct().ToList();
        // Senders may have been deactivated since; their name is still shown
        var users = await context.Users.IgnoreQueryFilters()
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, cancellationToken);
        var frontendUrl = appOptions.Value.FrontendUrl.TrimEnd('/');

        foreach (var forReceiver in claimed.GroupBy(m => m.ReceiverId))
        {
            var receiver = users[forReceiver.Key];
            var bySender = forReceiver.GroupBy(m => m.SenderId)
                .Select(g => (SenderId: g.Key, Latest: g.MaxBy(m => m.SentAt)!, Count: g.Count()))
                .OrderByDescending(s => s.Latest.SentAt)
                .ToList();
            var senders = bySender
                .Select(s => new UnreadFrom(SenderName(users.GetValueOrDefault(s.SenderId), receiver.PreferredLanguage), s.Count, s.Latest.Content))
                .ToList();

            // One sender: open that conversation directly; several: the inbox
            var link = senders.Count == 1
                ? $"{frontendUrl}/messages?user={bySender[0].SenderId}&name={Uri.EscapeDataString(senders[0].SenderName)}"
                : $"{frontendUrl}/messages";

            receiver.LastMessageEmailAt = now;
            emailQueue.Enqueue(EmailTemplates.UnreadMessages(
                receiver.Email, receiver.PreferredLanguage, UserService.DisplayName(receiver), senders, link));
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static string SenderName(User? user, string? language) => user switch
    {
        Player p => $"{p.FirstName} {p.LastName}",
        Club c => c.Name,
        _ => SharedResource.Get(AppMessages.General.UnknownUser, language)
    };
}
