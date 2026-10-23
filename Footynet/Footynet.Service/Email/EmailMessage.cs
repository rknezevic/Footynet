namespace Footynet.Service.Email;

public record EmailMessage(string To, string Subject, string HtmlBody, string TextBody);

// Emails are queued and sent by a background worker, so a slow mail server never delays an API request
public interface IEmailQueue
{
    void Enqueue(EmailMessage message);
}

public class AppOptions
{
    // Base URL of the Next.js frontend, used to build links in emails (no trailing slash)
    public string FrontendUrl { get; set; } = "http://localhost:3000";
}
