using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Service.Interfaces;

public interface IPlayerService
{
    Task<JobApplicationResponseDto> ApplyToJobAsync(Guid playerId, CreateApplicationDto dto);
    Task<PlayerProfileDto?> GetPlayerProfileAsync(Guid userId);
    Task<PlayerProfileDto> UpdatePlayerProfileAsync(Guid userId, UpdatePlayerProfileDto dto);
    Task<PaginatedResult<JobAdDto>> GetMyApplicationsAsync(Guid userId, int page = 1, int pageSize = 10);
    Task CancelApplicationAsync(Guid applicationId, Guid playerId);
    Task DeactivateAccountAsync(Guid playerId);
}