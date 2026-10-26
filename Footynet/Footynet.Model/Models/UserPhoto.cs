namespace Footynet.Models;

// Profile picture (player photo or club crest). Kept in its own table so loading a user never
// pulls the image bytes; User.PhotoUpdatedAt says whether a photo exists and versions its URL.
// Stored in the database because the hosting has no persistent disk; images are small (256x256).
public class UserPhoto
{
    public Guid UserId { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public byte[] Data { get; set; } = [];
    public DateTime UpdatedAt { get; set; }
}

public static class PhotoUrls
{
    // Relative to the API base URL (".../api/"). The ?v= part changes whenever the photo changes,
    // so browsers can cache each version forever and still see a new photo immediately.
    public static string? For(Guid userId, DateTime? updatedAt) =>
        updatedAt == null ? null : $"Users/{userId}/photo?v={updatedAt.Value.Ticks}";
}
