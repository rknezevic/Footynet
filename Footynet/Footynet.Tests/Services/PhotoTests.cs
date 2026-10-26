using Footynet.Controllers;
using Footynet.Models;

namespace Footynet.Tests.Services;

public class PhotoTests
{
    [Fact]
    public void DetectsSupportedImageTypesByTheirBytes()
    {
        Assert.Equal("image/jpeg", PhotoController.DetectImageType([0xFF, 0xD8, 0xFF, 0xE0, 0, 0]));
        Assert.Equal("image/png", PhotoController.DetectImageType([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0]));
        Assert.Equal("image/webp", PhotoController.DetectImageType("RIFF\0\0\0\0WEBPVP8 "u8.ToArray()));
    }

    [Fact]
    public void RejectsOtherFiles()
    {
        // e.g. a script or a PDF renamed to .jpg
        Assert.Null(PhotoController.DetectImageType("<script>alert(1)</script>"u8.ToArray()));
        Assert.Null(PhotoController.DetectImageType("%PDF-1.7"u8.ToArray()));
        Assert.Null(PhotoController.DetectImageType([]));
    }

    [Fact]
    public void PhotoUrlChangesWithEveryUpdate()
    {
        var id = Guid.NewGuid();
        var first = PhotoUrls.For(id, new DateTime(2026, 1, 1, 10, 0, 0, DateTimeKind.Utc));
        var second = PhotoUrls.For(id, new DateTime(2026, 1, 1, 10, 0, 1, DateTimeKind.Utc));

        Assert.StartsWith($"Users/{id}/photo?v=", first);
        Assert.NotEqual(first, second);
        Assert.Null(PhotoUrls.For(id, null));
    }
}
