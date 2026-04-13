using System.Data;
using Microsoft.EntityFrameworkCore;
using Footynet.Data;
using Footynet.Models;
using Footynet.DTOs;
using Dapper;
using Footynet.Repository.Interfaces;

namespace Footynet.Repository;

public class PlayerRepository : IPlayerRepository
{
    private readonly FootynetDbContext _context;
    private readonly IDbConnection _connection;

    public PlayerRepository(FootynetDbContext context, IDbConnection connection)
    {
        _context = context;
        _connection = connection;
    }

    public async Task<Player?> GetByIdAsync(Guid id)
    {
        return await _context.Users.OfType<Player>()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Player> UpdateAsync(Player player)
    {
        _context.Users.Update(player);
        await _context.SaveChangesAsync();
        return player;
    }

    public async Task<JobApplication> CreateApplicationAsync(JobApplication application)
    {
        _context.JobApplications.Add(application);
        await _context.SaveChangesAsync();
        return application;
    }

    //not that complicated to use dapper
    public async Task<JobApplication?> GetApplicationAsync(Guid playerId, Guid applicationId)
    {
        return await _context.JobApplications
            .FirstOrDefaultAsync(a => a.PlayerId == playerId && a.Id == applicationId);
    }

    public async Task CancelApplicationAsync(JobApplication application)
    {
        if (application != null)
        {
            application.Status = StatusType.Cancelled;
            _context.JobApplications.Update(application);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeactivateAccountAsync(Guid playerId)
    {
        var player = await GetByIdAsync(playerId);
        if (player != null)
        {
            player.IsActive = false;
            await UpdateAsync(player);
        }
    }


    public async Task<IEnumerable<JobAdDto>> GetPlayerApplicationsAsync(Guid playerId, StatusType? statusType = null, int page = 1, int pageSize = 10)
    {
        var offset = (page - 1) * pageSize;
        var sql = @"
            SELECT ja.""Id"", ja.""Title"", ja.""Description"",
                   c.""Name"" as ClubName, l.""Name"" as LeagueName,
                   ja.""RequiredPosition"",
                   a.""Status"" as ApplicationStatus,
                   ja.""CreatedAt""
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            JOIN ""Leagues"" l ON c.""LeagueId"" = l.""Id""
            JOIN ""JobApplications"" a ON ja.""Id"" = a.""JobAdId""
            WHERE a.""PlayerId"" = @playerId
            AND c.""IsActive"" = true
            AND (@statusType IS NULL OR a.""Status"" = @statusType)
            ORDER BY a.""AppliedAt"" DESC
            LIMIT @pageSize OFFSET @offset";

        return await _connection.QueryAsync<JobAdDto>(sql, new { playerId, statusType, pageSize, offset });
    }

    public async Task<int> GetPlayerApplicationsCountAsync(Guid playerId, StatusType? statusType = null)
    {
        var sql = @"
            SELECT COUNT(*)
            FROM ""JobApplications"" a
            JOIN ""JobAds"" ja ON a.""JobAdId"" = ja.""Id""
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            WHERE a.""PlayerId"" = @playerId
            AND c.""IsActive"" = true
            AND (@statusType IS NULL OR a.""Status"" = @statusType)";

        return await _connection.ExecuteScalarAsync<int>(sql, new { playerId, statusType });
    }
}