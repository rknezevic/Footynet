using System.Security.Claims;
using Footynet.Data;
using Footynet.Localization;
using Footynet.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Footynet.Controllers;

// Profile pictures: a player's photo or a club's crest
[ApiController]
public class PhotoController : ControllerBase
{
    // The frontend already resizes to 256x256 before uploading, so real uploads are a few dozen KB
    private const int MaxBytes = 1024 * 1024;

    private readonly FootynetDbContext _context;

    public PhotoController(FootynetDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("api/Users/{userId:guid}/photo")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPhoto(Guid userId)
    {
        var photo = await _context.UserPhotos.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId);
        if (photo == null)
            return NotFound();

        // URLs carry ?v=<timestamp>, so each version can be cached for good
        Response.Headers.CacheControl = "public, max-age=31536000, immutable";
        return File(photo.Data, photo.ContentType);
    }

    [HttpPut("api/Profile/photo")]
    [Authorize(Roles = "Player,Club")]
    [RequestSizeLimit(MaxBytes + 64 * 1024)]
    public async Task<ActionResult<object>> UploadPhoto(IFormFile? photo)
    {
        if (photo == null || photo.Length == 0)
            throw new ArgumentException(AppMessages.Photo.Missing);
        if (photo.Length > MaxBytes)
            throw new ArgumentException(AppMessages.Photo.TooLarge);

        using var buffer = new MemoryStream();
        await photo.CopyToAsync(buffer);
        var data = buffer.ToArray();

        // Trust the file's actual bytes, not the name or the declared content type
        var contentType = DetectImageType(data) ?? throw new ArgumentException(AppMessages.Photo.InvalidType);

        var userId = GetUserId();
        var user = await _context.Users.FirstAsync(u => u.Id == userId);
        var existing = await _context.UserPhotos.FirstOrDefaultAsync(p => p.UserId == userId);
        // PostgreSQL stores microseconds; trimming the extra 100 ns ticks keeps the ?v= value in this
        // response identical to the one built later from the database (no needless re-download)
        var now = DateTime.UtcNow;
        now = now.AddTicks(-(now.Ticks % 10));

        if (existing == null)
            _context.UserPhotos.Add(new UserPhoto { UserId = userId, ContentType = contentType, Data = data, UpdatedAt = now });
        else
        {
            existing.ContentType = contentType;
            existing.Data = data;
            existing.UpdatedAt = now;
        }
        user.PhotoUpdatedAt = now;
        await _context.SaveChangesAsync();

        return Ok(new { photoUrl = PhotoUrls.For(userId, now) });
    }

    [HttpDelete("api/Profile/photo")]
    [Authorize(Roles = "Player,Club")]
    public async Task<IActionResult> DeletePhoto()
    {
        var userId = GetUserId();
        var photo = await _context.UserPhotos.FirstOrDefaultAsync(p => p.UserId == userId);
        if (photo != null)
            _context.UserPhotos.Remove(photo);

        var user = await _context.Users.FirstAsync(u => u.Id == userId);
        user.PhotoUpdatedAt = null;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Recognises JPEG, PNG and WebP by their signature bytes
    public static string? DetectImageType(byte[] data)
    {
        if (data.Length >= 3 && data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF)
            return "image/jpeg";
        if (data.Length >= 8 && data.AsSpan(0, 8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }))
            return "image/png";
        if (data.Length >= 12 && data.AsSpan(0, 4).SequenceEqual("RIFF"u8) && data.AsSpan(8, 4).SequenceEqual("WEBP"u8))
            return "image/webp";
        return null;
    }
}
