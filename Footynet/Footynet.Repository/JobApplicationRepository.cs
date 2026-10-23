using System.Data;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Footynet.Localization;

namespace Footynet.Repository;

public class JobApplicationRepository : IJobApplicationRepository
{
    private readonly FootynetDbContext _context;
    private readonly IDbConnection _connection;

    public JobApplicationRepository(FootynetDbContext context, IDbConnection connection)
    {
        _context = context;
        _connection = connection;
    }

    public async Task<IEnumerable<JobApplication>> GetApplicationsByJobAdAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10, Guid? clubId = null)
    {
        var orderBy = orderByDateDesc ? "DESC" : "ASC";
        var offset = (page - 1) * pageSize;
        
        var sql = $@"
            SELECT ja.*, 
                   p.""Id"", p.""FirstName"", p.""LastName"", p.""Age"", p.""City"", p.""County"" AS CountyName, p.""Description"", p.""PrefeeredFootType"",
                   p.""PrimaryPosition"", p.""SecondaryPosition"", p.""Availability""
            FROM ""JobApplications"" ja
            JOIN ""Users"" p ON ja.""PlayerId"" = p.""Id""
            JOIN ""JobAds"" ad ON ja.""JobAdId"" = ad.""Id""
            WHERE ja.""JobAdId"" = @jobAdId
            AND (@clubId IS NULL OR ad.""ClubId"" = @clubId)
            AND p.""IsActive"" = true
            AND (@status IS NULL OR ja.""Status"" = @status)
            ORDER BY ja.""AppliedAt"" {orderBy}
            LIMIT @pageSize OFFSET @offset";

        var applications = await _connection.QueryAsync<JobApplication, Player, JobApplication>(
            sql,
            (application, player) =>
            {
                application.Player = player;
                return application;
            },
            new { jobAdId, status, pageSize, offset, clubId },
            splitOn: "Id"
        );

        // Load the career history of all listed players in one query
        var list = applications.ToList();
        var playerIds = list.Select(a => a.PlayerId).Distinct().ToList();
        if (playerIds.Count > 0)
        {
            var career = await _context.PlayerCareerEntries
                .Where(c => playerIds.Contains(c.PlayerId))
                .ToListAsync();
            foreach (var application in list)
                application.Player.CareerEntries = career.Where(c => c.PlayerId == application.PlayerId).ToList();
        }

        return list;
    }

    public async Task<int> GetApplicationsCountAsync(Guid jobAdId, StatusType? status = null, Guid? clubId = null)
    {
        var sql = @"
            SELECT COUNT(*)
            FROM ""JobApplications"" ja
            JOIN ""Users"" p ON ja.""PlayerId"" = p.""Id""
            JOIN ""JobAds"" ad ON ja.""JobAdId"" = ad.""Id""
            WHERE ja.""JobAdId"" = @jobAdId
            AND (@clubId IS NULL OR ad.""ClubId"" = @clubId)
            AND p.""IsActive"" = true
            AND (@status IS NULL OR ja.""Status"" = @status)";

        return await _connection.ExecuteScalarAsync<int>(sql, new { jobAdId, status, clubId });
    }

    public async Task<JobApplication?> GetByIdAsync(Guid id)
    {
        return await _context.JobApplications
            .Include(a => a.Player)
            .Include(a => a.JobAd)
            .ThenInclude(ja => ja.Club)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<JobApplication> UpdateStatusAsync(Guid applicationId, StatusType status)
    {
        var application = await _context.JobApplications.FindAsync(applicationId);
        if (application == null)
            throw new InvalidOperationException(AppMessages.Application.NotFound);

        application.Status = status;
        await _context.SaveChangesAsync();
        return application;
    }
}
