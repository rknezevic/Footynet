using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IJobApplicationRepository
{
    // clubId, when given, restricts results to job ads owned by that club
    Task<IEnumerable<JobApplication>> GetApplicationsByJobAdAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10, Guid? clubId = null);
    Task<int> GetApplicationsCountAsync(Guid jobAdId, StatusType? status = null, Guid? clubId = null);
    Task<JobApplication?> GetByIdAsync(Guid id);
    Task<JobApplication> UpdateStatusAsync(Guid applicationId, StatusType status);
}
