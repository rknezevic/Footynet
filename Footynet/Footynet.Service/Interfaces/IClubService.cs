using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Service.Interfaces;

public interface IClubService
{
    Task<PaginatedResult<JobApplication>> GetJobApplicationsAsync(Guid jobAdId, StatusType? status = null, bool orderByDateDesc = true, int page = 1, int pageSize = 10);
    Task AcceptApplicationAsync(Guid applicationId, Guid clubId);
    Task RejectApplicationAsync(Guid applicationId, Guid clubId);
    Task<int> GetApplicationCountAsync(Guid jobAdId);
    Task<ClubProfileDto?> GetClubProfileAsync(Guid clubId);
    Task UpdateClubProfileAsync(Guid clubId, UpdateClubProfileDto dto);
    Task DeactivateAccountAsync(Guid clubId);
}
