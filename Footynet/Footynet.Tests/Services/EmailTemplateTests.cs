using Footynet.Service.Email;

namespace Footynet.Tests.Services;

public class EmailTemplateTests
{
    [Fact]
    public void UnreadMessages_OneSender_ReadsLikeANewMessage()
    {
        var email = EmailTemplates.UnreadMessages("ivan@example.com", "hr", "Ivan",
            [new UnreadFrom("NK Primjer", 2, "Dođi na probni trening u utorak")], "https://footynet.test/messages?user=x");

        Assert.Equal("Nova poruka od: NK Primjer", email.Subject);
        Assert.Contains("Dođi na probni trening u utorak", email.TextBody);
        Assert.Contains("https://footynet.test/messages?user=x", email.HtmlBody);
    }

    [Fact]
    public void UnreadMessages_SeveralSenders_ListsEachWithCountAndTotalInSubject()
    {
        var email = EmailTemplates.UnreadMessages("ivan@example.com", "en", "Ivan",
            [new UnreadFrom("NK Primjer", 2, "See you Tuesday"), new UnreadFrom("HNK Test", 1, "Are you available?")],
            "https://footynet.test/messages");

        Assert.Equal("Unread messages on FootyNet (3)", email.Subject);
        Assert.Contains("NK Primjer (2)", email.TextBody);
        Assert.Contains("HNK Test (1)", email.TextBody);
        Assert.Contains("Are you available?", email.HtmlBody);
    }

    [Fact]
    public void ClubDecision_Approved_LinksToSignIn()
    {
        var email = EmailTemplates.ClubDecision("klub@example.com", "hr", "NK Primjer", approved: true, "https://footynet.test/login");

        Assert.Equal("Vaš klub je odobren", email.Subject);
        Assert.Contains("NK Primjer", email.TextBody);
        Assert.Contains("https://footynet.test/login", email.HtmlBody);
    }

    [Fact]
    public void ClubDecision_Rejected_HasNoSignInButton()
    {
        var email = EmailTemplates.ClubDecision("klub@example.com", "en", "NK Primjer", approved: false, "https://footynet.test/login");

        Assert.Equal("Your club registration was not approved", email.Subject);
        Assert.DoesNotContain("https://footynet.test/login", email.HtmlBody);
    }

    [Fact]
    public void UnreadMessages_EscapesMessageContentInHtml()
    {
        var email = EmailTemplates.UnreadMessages("ivan@example.com", "en", "Ivan",
            [new UnreadFrom("Mallory", 1, "<script>alert(1)</script>")], "https://footynet.test/messages");

        Assert.DoesNotContain("<script>", email.HtmlBody);
        Assert.Contains("&lt;script&gt;", email.HtmlBody);
    }
}
