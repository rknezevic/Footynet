using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Service.Interfaces;
public interface IJobAdService
{
    Task<ClubJobAdDto> CreateJobAdAsync(CreateJobAdDto dto, Guid clubId);
    Task<ClubJobAdDto> UpdateJobAdAsync(Guid id, CreateJobAdDto dto, Guid clubId);
    Task CloseJobAdAsync(Guid id, Guid clubId);
    Task ReopenJobAdAsync(Guid id, Guid clubId);
    Task<IEnumerable<JobAdDto>> GetAllAsync(int page = 1, int pageSize = 10, PositionType? position = null, Guid? leagueId = null, string? searchTerm = null, Guid? excludePlayerId = null, bool sortDescending = true);
    Task<JobAd?> GetByIdAsync(Guid id);
    Task<IEnumerable<ClubJobAdDto>> GetByClubAsync(Guid clubId);
}
