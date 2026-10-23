using System.Net;
using Footynet.Localization;
using Footynet.Model;

namespace Footynet.Service.Email;

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
            Layout(greeting, intro, T(AppMessages.Email.VerificationButton), link, footer, null),
            $"{greeting}\n\n{intro}\n\n{link}\n\n{footer}");
    }

    public static EmailMessage NewMessage(string to, string? language, string recipientName, string senderName, string preview, string link)
    {
        string T(string key, params object[] args) => SharedResource.Get(key, language, args);

        var greeting = T(AppMessages.Email.Greeting, recipientName);
        var intro = T(AppMessages.Email.NewMessageIntro, senderName);
        var footer = T(AppMessages.Email.NewMessageFooter);
        var shortPreview = preview.Length > 200 ? preview[..200] + "…" : preview;

        return new EmailMessage(to, T(AppMessages.Email.NewMessageSubject, senderName),
            Layout(greeting, intro, T(AppMessages.Email.NewMessageButton), link, footer, shortPreview),
            $"{greeting}\n\n{intro}\n\n\"{shortPreview}\"\n\n{link}\n\n{footer}");
    }

    private static string Layout(string greeting, string intro, string buttonText, string link, string footer, string? quote)
    {
        string E(string s) => WebUtility.HtmlEncode(s);
        var quoteHtml = quote == null ? "" : $"""
            <p style="margin:0 0 24px;padding:14px 18px;background:#f1f5f9;border-left:4px solid #10b981;border-radius:8px;color:#334155;font-size:15px;line-height:1.5;">{E(quote)}</p>
            """;

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
                      <a href="{E(link)}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">{E(buttonText)}</a>
                      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;">{E(footer)}</p>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
            </body></html>
            """;
    }
}
