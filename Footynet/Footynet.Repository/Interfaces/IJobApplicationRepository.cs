using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IJobApplicationRepository
{
    Task<IEnumerable<JobApplication>> GetApplicationsByJobAdAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10);
    Task<int> GetApplicationsCountAsync(Guid jobAdId, StatusType? status = null);
    Task<JobApplication?> GetByIdAsync(Guid id);
    Task<JobApplication> UpdateStatusAsync(Guid applicationId, StatusType status);
}
