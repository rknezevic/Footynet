using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IMessageRepository
{
    Task<Message> CreateAsync(Message message);
    Task<IEnumerable<Message>> GetConversationAsync(Guid userId, Guid otherUserId);
    Task<IEnumerable<Message>> GetInboxAsync(Guid userId);
}
