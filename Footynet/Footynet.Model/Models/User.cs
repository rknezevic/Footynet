namespace Footynet.Models;

public abstract class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Email confirmation: only the SHA-256 hash of the token is stored, so a database leak
    // doesn't expose usable confirmation links
    public bool EmailConfirmed { get; set; }
    public string? EmailConfirmationTokenHash { get; set; }
    public DateTime? EmailConfirmationExpiresAt { get; set; }
    public DateTime? EmailConfirmationSentAt { get; set; }

    // Password reset ("forgot password"): stored the same way as the confirmation token
    public string? PasswordResetTokenHash { get; set; }
    public DateTime? PasswordResetExpiresAt { get; set; }
    public DateTime? PasswordResetSentAt { get; set; }

    // When the user accepted the Terms of Use and Privacy Policy at registration (GDPR record of consent)
    public DateTime? TermsAcceptedAt { get; set; }

    // "hr" or "en"; used for emails, which are sent outside of any request
    public string? PreferredLanguage { get; set; }
    // Throttles "new message" email notifications
    public DateTime? LastMessageEmailAt { get; set; }
    // Set when the user has a profile picture (see UserPhoto)
    public DateTime? PhotoUpdatedAt { get; set; }
    public abstract RoleType Role { get; }
}

public enum RoleType
{
    Player = 0,
    Club = 1,
    Admin = 2
}