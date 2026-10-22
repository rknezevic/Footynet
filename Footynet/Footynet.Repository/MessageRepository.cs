using System.Data;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Dapper;

namespace Footynet.Repository;

public class MessageRepository : IMessageRepository
{
    private readonly FootynetDbContext _context;
    private readonly IDbConnection _connection;

    public MessageRepository(FootynetDbContext context, IDbConnection connection)
    {
        _context = context;
        _connection = connection;
    }

    public async Task<Message> CreateAsync(Message message)
    {
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<IEnumerable<Message>> GetConversationAsync(Guid userId, Guid otherUserId)
    {
        return await _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                       (m.SenderId == otherUserId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Message>> GetInboxAsync(Guid userId)
    {
        var sql = @"
            WITH LatestMessages AS (
                SELECT DISTINCT ON (
                    CASE 
                        WHEN ""SenderId"" = @userId THEN ""ReceiverId""
                        ELSE ""SenderId""
                    END
                ) *
                FROM ""Messages""
                WHERE ""SenderId"" = @userId OR ""ReceiverId"" = @userId
                ORDER BY 
                    CASE 
                        WHEN ""SenderId"" = @userId THEN ""ReceiverId""
                        ELSE ""SenderId""
                    END,
                    ""SentAt"" DESC
            )
            SELECT * FROM LatestMessages
            ORDER BY ""SentAt"" DESC";

        return await _connection.QueryAsync<Message>(sql, new { userId });
    }

    public async Task<bool> AreConnectedAsync(Guid userId, Guid otherUserId)
    {
        return await _context.JobApplications
            .AnyAsync(a => a.Status == StatusType.Accepted &&
                ((a.PlayerId == userId && a.JobAd.ClubId == otherUserId) ||
                 (a.PlayerId == otherUserId && a.JobAd.ClubId == userId)));
    }

    public async Task<int> MarkConversationReadAsync(Guid userId, Guid otherUserId)
    {
        return await _context.Messages
            .Where(m => m.SenderId == otherUserId && m.ReceiverId == userId && !m.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsRead, true));
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        return await _context.Messages.CountAsync(m => m.ReceiverId == userId && !m.IsRead);
    }
}
