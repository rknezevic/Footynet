using System.Data;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Dapper;

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

    public async Task<IEnumerable<JobApplication>> GetApplicationsByJobAdAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10)
    {
        var orderBy = orderByDateDesc ? "DESC" : "ASC";
        var offset = (page - 1) * pageSize;
        
        var sql = $@"
            SELECT ja.*, 
                   p.""Id"", p.""Email"", p.""FirstName"", p.""LastName"", p.""Age"", p.""City"", p.""County"", p.""Description"", p.""PrefeeredFootType""
            FROM ""JobApplications"" ja
            JOIN ""Users"" p ON ja.""PlayerId"" = p.""Id""
            WHERE ja.""JobAdId"" = @jobAdId
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
            new { jobAdId, status, pageSize, offset },
            splitOn: "Id"
        );

        return applications;
    }

    public async Task<int> GetApplicationsCountAsync(Guid jobAdId, StatusType? status = null)
    {
        var sql = @"
            SELECT COUNT(*)
            FROM ""JobApplications"" ja
            JOIN ""Users"" p ON ja.""PlayerId"" = p.""Id""
            WHERE ja.""JobAdId"" = @jobAdId
            AND p.""IsActive"" = true
            AND (@status IS NULL OR ja.""Status"" = @status)";

        return await _connection.ExecuteScalarAsync<int>(sql, new { jobAdId, status });
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
            throw new InvalidOperationException("Application not found");

        application.Status = status;
        await _context.SaveChangesAsync();
        return application;
    }
}
