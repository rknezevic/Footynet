using System.Net;
using Footynet.Localization;
using Footynet.Model;

namespace Footynet.Service.Email;

// Unread messages from one sender, for the unread-messages email
public record UnreadFrom(string SenderName, int Count, string LatestContent);

// Builds HTML + plain-text emails. All wording comes from the resource files (AppMessages.Email.*),
// in the recipient's language. Inline styles only: most email clients ignore <style> blocks.
public static class EmailTemplates
{
    public static EmailMessage Verification(string to, string? language, string displayName, string link)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);

        var greeting = T(AppMessages.Email.Greeting, displayName);
        var intro = T(AppMessages.Email.VerificationIntro);
        var footer = T(AppMessages.Email.VerificationFooter);

        return new EmailMessage(to, T(AppMessages.Email.VerificationSubject),
            Layout(greeting, intro, T(AppMessages.Email.VerificationButton), link, footer, []),
            $"{greeting}\n\n{intro}\n\n{link}\n\n{footer}");
    }

    public static EmailMessage PasswordReset(string to, string? language, string displayName, string link)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);

        var greeting = T(AppMessages.Email.Greeting, displayName);
        var intro = T(AppMessages.Email.PasswordResetIntro);
        var footer = T(AppMessages.Email.PasswordResetFooter);

        return new EmailMessage(to, T(AppMessages.Email.PasswordResetSubject),
            Layout(greeting, intro, T(AppMessages.Email.PasswordResetButton), link, footer, []),
            $"{greeting}\n\n{intro}\n\n{link}\n\n{footer}");
    }

    // Messages the recipient hasn't read for a while: one sender reads like a single new message,
    // several senders are listed with their message count and latest message each
    public static EmailMessage UnreadMessages(string to, string? language, string recipientName, IReadOnlyList<UnreadFrom> senders, string link)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);
        static string Short(string text) => text.Length > 200 ? text[..200] + "…" : text;

        var greeting = T(AppMessages.Email.Greeting, recipientName);
        var footer = T(AppMessages.Email.NewMessageFooter);

        if (senders.Count == 1)
        {
            var only = senders[0];
            var intro = T(AppMessages.Email.NewMessageIntro, only.SenderName);
            var preview = Short(only.LatestContent);
            return new EmailMessage(to, T(AppMessages.Email.NewMessageSubject, only.SenderName),
                Layout(greeting, intro, T(AppMessages.Email.NewMessageButton), link, footer, [(null, preview)]),
                $"{greeting}\n\n{intro}\n\n\"{preview}\"\n\n{link}\n\n{footer}");
        }

        var listIntro = T(AppMessages.Email.UnreadIntro);
        var quotes = senders.Select(s => ((string?)$"{s.SenderName} ({s.Count})", Short(s.LatestContent))).ToList();
        var text = string.Join("\n\n", quotes.Select(q => $"{q.Item1}\n\"{q.Item2}\""));
        return new EmailMessage(to, T(AppMessages.Email.UnreadSubject, senders.Sum(s => s.Count)),
            Layout(greeting, listIntro, T(AppMessages.Email.UnreadButton), link, footer, quotes),
            $"{greeting}\n\n{listIntro}\n\n{text}\n\n{link}\n\n{footer}");
    }

    // To each administrator when a club has confirmed its email and waits for approval
    public static EmailMessage AdminNewClub(string to, string? language, string clubName, string clubEmail, string link)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);

        var greeting = T(AppMessages.Email.Greeting, "admin");
        var intro = T(AppMessages.Email.AdminNewClubIntro, clubName, clubEmail);
        var footer = T(AppMessages.Email.AdminNewClubFooter);

        return new EmailMessage(to, T(AppMessages.Email.AdminNewClubSubject, clubName),
            Layout(greeting, intro, T(AppMessages.Email.AdminNewClubButton), link, footer, []),
            $"{greeting}\n\n{intro}\n\n{link}\n\n{footer}");
    }

    // To the club once an administrator has approved (link to sign in) or rejected it (no link)
    public static EmailMessage ClubDecision(string to, string? language, string clubName, bool approved, string signInLink)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);

        var greeting = T(AppMessages.Email.Greeting, clubName);
        var footer = T(AppMessages.Email.ClubDecisionFooter);

        if (approved)
        {
            var intro = T(AppMessages.Email.ClubApprovedIntro, clubName);
            return new EmailMessage(to, T(AppMessages.Email.ClubApprovedSubject),
                Layout(greeting, intro, T(AppMessages.Email.ClubApprovedButton), signInLink, footer, []),
                $"{greeting}\n\n{intro}\n\n{signInLink}\n\n{footer}");
        }

        var rejected = T(AppMessages.Email.ClubRejectedIntro, clubName);
        return new EmailMessage(to, T(AppMessages.Email.ClubRejectedSubject),
            Layout(greeting, rejected, null, null, footer, []),
            $"{greeting}\n\n{rejected}\n\n{footer}");
    }

    private static string Layout(string greeting, string intro, string? buttonText, string? link, string footer,
        IReadOnlyList<(string? Title, string Text)> quotes)
    {
        string E(string s) => WebUtility.HtmlEncode(s);
        var quoteHtml = string.Concat(quotes.Select(q => $"""
            {(q.Title == null ? "" : $"""<p style="margin:0 0 6px;color:#0f172a;font-size:14px;font-weight:600;">{E(q.Title)}</p>""")}
            <p style="margin:0 0 20px;padding:14px 18px;background:#f1f5f9;border-left:4px solid #10b981;border-radius:8px;color:#334155;font-size:15px;line-height:1.5;">{E(q.Text)}</p>
            """));

        var buttonHtml = link == null || buttonText == null ? "" :
            $"""<a href="{E(link)}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">{E(buttonText)}</a>""";

        return $"""
            <!doctype html>
            <html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
                <tr><td align="center">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr><td style="background:#059669;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:700;">⚽ FootyNet</td></tr>
                    <tr><td style="padding:28px;">
                      <p style="margin:0 0 12px;color:#0f172a;font-size:16px;font-weight:600;">{E(greeting)}</p>
                      <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.5;">{E(intro)}</p>
                      {quoteHtml}
                      {buttonHtml}
                      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">{E(footer)}</p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body></html>
            """;
    }
}
