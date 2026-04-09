using Footynet.Models;
using Footynet.DTOs;

namespace Footynet.Repository.Interfaces;

public interface IPlayerRepository
{
    Task<Player?> GetByIdAsync(Guid id);
    Task<Player> UpdateAsync(Player player);
    Task<JobApplication> CreateApplicationAsync(JobApplication application);
    Task<JobApplication?> GetApplicationAsync(Guid playerId, Guid applicationId);
    Task<IEnumerable<JobAdDto>> GetPlayerApplicationsAsync(Guid playerId, StatusType? statusType = null, int page = 1, int pageSize = 10);
    Task<int> GetPlayerApplicationsCountAsync(Guid playerId, StatusType? statusType = null);
    Task CancelApplicationAsync(JobApplication application);
    Task DeactivateAccountAsync(Guid userId);

}