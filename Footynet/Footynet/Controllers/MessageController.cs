using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageRepository _messageRepository;
    private readonly FootynetDbContext _context;

    public MessageController(IMessageRepository messageRepository, FootynetDbContext context)
    {
        _messageRepository = messageRepository;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
    {
        var senderId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content,
            SentAt = DateTime.UtcNow
        };
        
        var created = await _messageRepository.CreateAsync(message);
        return Ok(new
        {
            created.Id,
            created.SenderId,
            created.ReceiverId,
            created.Content,
            created.SentAt,
            created.IsRead
        });
    }

    [HttpGet("conversation/{otherUserId}")]
    public async Task<IActionResult> GetConversation(Guid otherUserId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var messages = await _messageRepository.GetConversationAsync(userId, otherUserId);
        return Ok(messages.Select(m => new
        {
            m.Id,
            m.SenderId,
            m.ReceiverId,
            m.Content,
            m.SentAt,
            m.IsRead
        }));
    }

    [HttpGet("inbox")]
    public async Task<IActionResult> GetInbox()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var messages = await _messageRepository.GetInboxAsync(userId);
        
        var userIds = messages.Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId).Distinct().ToList();
        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();
        
        string GetDisplayName(Guid id)
        {
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user is Player p) return $"{p.FirstName} {p.LastName}";
            if (user is Club c) return c.Name;
            return "Unknown";
        }
        
        return Ok(messages.Select(m => {
            var otherUserId = m.SenderId == userId ? m.ReceiverId : m.SenderId;
            return new
            {
                m.Id,
                m.SenderId,
                m.ReceiverId,
                m.Content,
                m.SentAt,
                m.IsRead,
                OtherUserName = GetDisplayName(otherUserId)
            };
        }));
    }

    [HttpGet("user-name/{userId}")]
    public async Task<IActionResult> GetUserName(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        
        string displayName;
        if (user is Player p) displayName = $"{p.FirstName} {p.LastName}";
        else if (user is Club c) displayName = c.Name;
        else displayName = "Unknown";
        
        return Ok(new { displayName });
    }
}

public record CreateMessageDto(Guid ReceiverId, string Content);
