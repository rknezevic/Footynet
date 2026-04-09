using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Service.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardDto> GetDashboardAsync();
    Task<PaginatedResult<PendingClubDto>> GetPendingClubsAsync(int page, int pageSize);
    Task ApproveClubAsync(Guid clubId);
    Task RejectClubAsync(Guid clubId);
    Task<PaginatedResult<AdminUserDto>> GetUsersAsync(string? search, RoleType? role, int page, int pageSize);
    Task DeactivateUserAsync(Guid userId, Guid adminId);
    Task ReactivateUserAsync(Guid userId);
    Task<PaginatedResult<AdminJobAdDto>> GetJobAdsAsync(string? search, int page, int pageSize);
    Task DeleteJobAdAsync(Guid jobAdId);
}
