using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Globalization;
using System.Security.Claims;
using Footynet.Model;
using Footynet.Data;
using Footynet.Hubs;
using Footynet.Exceptions;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Footynet.Localization;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageRepository _messageRepository;
    private readonly FootynetDbContext _context;
    private readonly IHubContext<ChatHub> _hub;
    private readonly MessageEmailNotifier _emailNotifier;

    public MessageController(IMessageRepository messageRepository, FootynetDbContext context, IHubContext<ChatHub> hub, MessageEmailNotifier emailNotifier)
    {
        _messageRepository = messageRepository;
        _context = context;
        _hub = hub;
        _emailNotifier = emailNotifier;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] CreateMessageDto dto)
    {
        var senderId = GetUserId();
        if (!await _messageRepository.AreConnectedAsync(senderId, dto.ReceiverId))
            throw new ForbiddenException(AppMessages.Messaging.NotConnected);

        var message = new Message
        {
            Id = Guid.NewGuid(),
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content,
            SentAt = DateTime.UtcNow
        };

        var created = await _messageRepository.CreateAsync(message);
        var result = MessageDto.From(created, await GetDisplayNameAsync(senderId));

        // Push to the receiver and to the sender's other open tabs, no polling needed
        await _hub.Clients.Users(dto.ReceiverId.ToString(), senderId.ToString())
            .SendAsync(ChatHub.ReceiveMessage, result);
        // If the receiver isn't in the app right now, let them know by email (throttled)
        await _emailNotifier.NotifyAsync(dto.ReceiverId, senderId, result.SenderName ?? "", created.Content);

        return Ok(result);
    }

    [HttpGet("conversation/{otherUserId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetConversation(Guid otherUserId)
    {
        var messages = await _messageRepository.GetConversationAsync(GetUserId(), otherUserId);
        return Ok(messages.Select(m => MessageDto.From(m)));
    }

    [HttpPost("conversation/{otherUserId}/read")]
    public async Task<IActionResult> MarkConversationRead(Guid otherUserId)
    {
        var userId = GetUserId();
        var updated = await _messageRepository.MarkConversationReadAsync(userId, otherUserId);
        if (updated > 0)
        {
            // Lets the reader's other tabs refresh their unread badge and the sender see "read"
            await _hub.Clients.Users(userId.ToString(), otherUserId.ToString())
                .SendAsync(ChatHub.MessagesRead, new { readerId = userId, otherUserId });
        }
        return NoContent();
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        return Ok(await _messageRepository.GetUnreadCountAsync(GetUserId()));
    }

    [HttpGet("inbox")]
    public async Task<IActionResult> GetInbox()
    {
        var userId = GetUserId();
        var messages = await _messageRepository.GetInboxAsync(userId);

        var userIds = messages.Select(m => m.SenderId == userId ? m.ReceiverId : m.SenderId).Distinct().ToList();
        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();
        var unreadBySender = await _context.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .GroupBy(m => m.SenderId)
            .Select(g => new { SenderId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.SenderId, x => x.Count);

        return Ok(messages.Select(m =>
        {
            var otherUserId = m.SenderId == userId ? m.ReceiverId : m.SenderId;
            return new
            {
                m.Id,
                m.SenderId,
                m.ReceiverId,
                m.Content,
                m.SentAt,
                m.IsRead,
                OtherUserId = otherUserId,
                OtherUserName = DisplayName(users.FirstOrDefault(u => u.Id == otherUserId)),
                UnreadCount = unreadBySender.GetValueOrDefault(otherUserId)
            };
        }));
    }

    [HttpGet("user-name/{userId}")]
    public async Task<IActionResult> GetUserName(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound();
        return Ok(new { displayName = DisplayName(user) });
    }

    private async Task<string> GetDisplayNameAsync(Guid userId) =>
        DisplayName(await _context.Users.FirstOrDefaultAsync(u => u.Id == userId));

    private static string DisplayName(User? user) => user switch
    {
        Player p => $"{p.FirstName} {p.LastName}",
        Club c => c.Name,
        _ => SharedResource.Get(AppMessages.General.UnknownUser, CultureInfo.CurrentUICulture.TwoLetterISOLanguageName)
    };
}

public record CreateMessageDto(Guid ReceiverId, string Content);

public record MessageDto(Guid Id, Guid SenderId, Guid ReceiverId, string Content, DateTime SentAt, bool IsRead, string? SenderName)
{
    public static MessageDto From(Message m, string? senderName = null) =>
        new(m.Id, m.SenderId, m.ReceiverId, m.Content, m.SentAt, m.IsRead, senderName);
}
