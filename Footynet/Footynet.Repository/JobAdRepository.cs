using System.Data;
using Footynet.Models;
using Footynet.DTOs;
using Footynet.Data;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Footynet.Repository.Interfaces;

namespace Footynet.Repository;

public class JobAdRepository : IJobAdRepository
{
    private readonly FootynetDbContext _context;
    private readonly IDbConnection _connection;


    public JobAdRepository(FootynetDbContext context, IDbConnection connection)
    {
        _context = context;
        _connection = connection;
    }

    public async Task<IEnumerable<JobAd>> GetAdsByClubAsync(Guid clubId)
    {
        return await _context.JobAds
            .Include(p => p.Applications)
            .ThenInclude(a => a.Player)
            .Where(p => p.ClubId == clubId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<JobAd?> GetByIdAsync(Guid id)
    {
        return await _context.JobAds
            .Include(p => p.Club)
            .Include(p => p.Applications)
            .ThenInclude(a => a.Player)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<JobAd> CreateAsync(JobAd jobAd)
    {
        _context.JobAds.Add(jobAd);
        await _context.SaveChangesAsync();
        return jobAd;
    }

    public async Task<JobAd> UpdateAsync(JobAd jobAd)
    {
        _context.JobAds.Update(jobAd);
        await _context.SaveChangesAsync();
        return jobAd;
    }

    public async Task<IEnumerable<JobAdDto>> GetAllAsync(int page, int pageSize, PositionType? position, 
        Guid? leagueId, string? searchTerm, Guid? excludePlayerId = null, bool sortDescending = true)
    {
        var offset = (page - 1) * pageSize;
        var orderBy = sortDescending ? "DESC" : "ASC";
        var sql = $@"
            SELECT ja.""Id"", ja.""Title"", ja.""Description"", 
                   c.""Name"" as ClubName, l.""Name"" as LeagueName, 
                   ja.""RequiredPosition"",
                   ja.""CreatedAt""
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            JOIN ""Leagues"" l ON c.""LeagueId"" = l.""Id""
            LEFT JOIN ""JobApplications"" app ON ja.""Id"" = app.""JobAdId"" AND app.""PlayerId"" = @excludePlayerId
            WHERE ja.""AdStatus"" = 0
            AND c.""IsActive"" = true
            AND (@excludePlayerId IS NULL OR app.""Id"" IS NULL)
            AND (@position IS NULL OR ja.""RequiredPosition"" = @position)
            AND (@leagueId IS NULL OR l.""Id"" = @leagueId)
            AND (@searchTerm IS NULL OR ja.""Title"" LIKE '%' || @searchTerm || '%' OR ja.""Description"" LIKE '%' || @searchTerm || '%')
            ORDER BY ja.""CreatedAt"" {orderBy}
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY";

        return await _connection.QueryAsync<JobAdDto>(sql, new { offset, pageSize, position, leagueId, searchTerm, excludePlayerId });
    }

    public async Task<IEnumerable<JobAdDto>> GetAdsByPlayerAsync(Guid playerId)
    {
        var sql = @"
            SELECT ja.""Id"", ja.""Title"", ja.""Description"",
                   c.""Name"" as ClubName, l.""Name"" as LeagueName,
                   ja.""RequiredPosition"",
                   a.""Status"" as ApplicationStatus
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            JOIN ""Leagues"" l ON c.""LeagueId"" = l.""Id""
            JOIN ""JobApplications"" a ON ja.""Id"" = a.""JobAdId""
            WHERE a.""PlayerId"" = @playerId
            ORDER BY ja.""CreatedAt"" DESC";

        return await _connection.QueryAsync<JobAdDto>(sql, new { playerId });
    }

    public async Task<IEnumerable<JobAdDto>> FilterAppliedAdsAsync(Guid playerId, StatusType statusType)
    {
        var sql = @"
            SELECT ja.""Id"", ja.""Title"", ja.""Description"",
                   c.""Name"" as ClubName, l.""Name"" as LeagueName,
                   ja.""RequiredPosition"",
                   a.""Status"" as ApplicationStatus
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            JOIN ""Leagues"" l ON c.""LeagueId"" = l.""Id""
            JOIN ""JobApplications"" a ON ja.""Id"" = a.""JobAdId""
            WHERE a.""PlayerId"" = @playerId
            AND (@statusType IS NULL OR a.""Status"" = @statusType)
            ORDER BY ja.""CreatedAt"" DESC";

        return await _connection.QueryAsync<JobAdDto>(sql, new { playerId, statusType });
    }

}