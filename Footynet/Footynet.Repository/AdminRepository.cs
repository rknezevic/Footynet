using System.Data;
using Dapper;
using Footynet.Data;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Footynet.Repository;

public class AdminRepository : IAdminRepository
{
    private readonly FootynetDbContext _context;
    private readonly IDbConnection _connection;

    public AdminRepository(FootynetDbContext context, IDbConnection connection)
    {
        _context = context;
        _connection = connection;
    }

    public async Task<AdminDashboardDto> GetDashboardStatsAsync()
    {
        var sql = @"
            SELECT
                (SELECT COUNT(*) FROM ""Users"" WHERE ""UserType"" = 'Player' AND ""IsActive"" = true) AS ""PlayerCount"",
                (SELECT COUNT(*) FROM ""Users"" WHERE ""UserType"" = 'Club' AND ""IsActive"" = true AND ""IsApproved"" = true) AS ""ClubCount"",
                (SELECT COUNT(*) FROM ""Users"" WHERE ""UserType"" = 'Club' AND ""IsActive"" = true AND ""IsApproved"" = false) AS ""PendingClubCount"",
                (SELECT COUNT(*) FROM ""JobAds"" ja JOIN ""Users"" c ON ja.""ClubId"" = c.""Id"" WHERE c.""IsActive"" = true) AS ""JobAdCount""";

        return await _connection.QuerySingleAsync<AdminDashboardDto>(sql);
    }

    public async Task<(IEnumerable<PendingClubDto> Items, int TotalCount)> GetPendingClubsAsync(int page, int pageSize)
    {
        var query = _context.Users.OfType<Club>()
            .Include(c => c.League)
            .Where(c => c.IsActive && !c.IsApproved);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(c => c.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new PendingClubDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                City = c.City,
                LeagueName = c.League != null ? c.League.Name : ""
            })
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Club?> GetClubByIdAsync(Guid clubId)
    {
        return await _context.Users.OfType<Club>()
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == clubId);
    }

    public async Task UpdateClubAsync(Club club)
    {
        _context.Users.Update(club);
        await _context.SaveChangesAsync();
    }

    public async Task<(IEnumerable<AdminUserDto> Items, int TotalCount)> GetUsersAsync(string? search, RoleType? role, int page, int pageSize)
    {
        var offset = (page - 1) * pageSize;

        var countSql = @"
            SELECT COUNT(*)
            FROM ""Users""
            WHERE (@search IS NULL OR LOWER(""Email"") LIKE '%' || LOWER(@search) || '%')
            AND (@role IS NULL OR ""UserType"" = @roleType)";

        var dataSql = @"
            SELECT ""Id"", ""Email"", ""UserType"" AS ""Role"", ""IsActive""
            FROM ""Users""
            WHERE (@search IS NULL OR LOWER(""Email"") LIKE '%' || LOWER(@search) || '%')
            AND (@role IS NULL OR ""UserType"" = @roleType)
            ORDER BY ""Email""
            LIMIT @pageSize OFFSET @offset";

        var roleType = role switch
        {
            RoleType.Player => "Player",
            RoleType.Club => "Club",
            RoleType.Admin => "Admin",
            _ => (string?)null
        };

        var parameters = new { search, role = role.HasValue ? (int?)1 : null, roleType, offset, pageSize };

        var totalCount = await _connection.ExecuteScalarAsync<int>(countSql, parameters);
        var items = await _connection.QueryAsync<AdminUserDto>(dataSql, parameters);

        return (items, totalCount);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<(IEnumerable<AdminJobAdDto> Items, int TotalCount)> GetJobAdsAsync(string? search, int page, int pageSize)
    {
        var offset = (page - 1) * pageSize;

        var countSql = @"
            SELECT COUNT(*)
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            WHERE c.""IsActive"" = true
            AND (@search IS NULL OR LOWER(ja.""Title"") LIKE '%' || LOWER(@search) || '%')";

        var dataSql = @"
            SELECT ja.""Id"", ja.""Title"", c.""Name"" AS ""ClubName"",
                   ja.""CreatedAt"",
                   CASE ja.""AdStatus"" WHEN 0 THEN 'Open' WHEN 1 THEN 'Closed' ELSE 'Unknown' END AS ""AdStatus""
            FROM ""JobAds"" ja
            JOIN ""Users"" c ON ja.""ClubId"" = c.""Id""
            WHERE c.""IsActive"" = true
            AND (@search IS NULL OR LOWER(ja.""Title"") LIKE '%' || LOWER(@search) || '%')
            ORDER BY ja.""CreatedAt"" DESC
            LIMIT @pageSize OFFSET @offset";

        var totalCount = await _connection.ExecuteScalarAsync<int>(countSql, new { search });
        var items = await _connection.QueryAsync<AdminJobAdDto>(dataSql, new { search, offset, pageSize });

        return (items, totalCount);
    }

    public async Task DeleteJobAdAsync(Guid jobAdId)
    {
        var jobAd = await _context.JobAds
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == jobAdId);

        if (jobAd != null)
        {
            _context.JobApplications.RemoveRange(jobAd.Applications);
            _context.JobAds.Remove(jobAd);
            await _context.SaveChangesAsync();
        }
    }
}
