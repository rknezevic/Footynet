using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IJobAdRepository
{
    Task<IEnumerable<JobAd>> GetAdsByClubAsync(Guid clubId);
    Task<JobAd?> GetByIdAsync(Guid id);
    Task<JobAd> CreateAsync(JobAd jobAd);
    Task<JobAd> UpdateAsync(JobAd jobAd);
    Task<IEnumerable<JobAdDto>> GetAllAsync(int page, int pageSize, PositionType? position, Guid? leagueId, Guid? countyId, string? searchTerm, Guid? excludePlayerId = null, bool sortDescending = true);
    Task<IEnumerable<JobAdDto>> GetAdsByPlayerAsync(Guid userId);
    Task<IEnumerable<JobAdDto>> FilterAppliedAdsAsync(Guid playerId, StatusType statusType);



}