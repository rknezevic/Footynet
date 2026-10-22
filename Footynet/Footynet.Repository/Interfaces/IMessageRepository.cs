using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task<IEnumerable<Message>> GetConversationAsync(Guid userId, Guid otherUserId);
    Task<IEnumerable<Message>> GetInboxAsync(Guid userId);
    // True when a player and a club are connected through an accepted job application
    Task<bool> AreConnectedAsync(Guid userId, Guid otherUserId);
    // Marks messages sent by otherUserId to userId as read; returns how many were updated
    Task<int> MarkConversationReadAsync(Guid userId, Guid otherUserId);
    Task<int> GetUnreadCountAsync(Guid userId);
}
