using Footynet.DTOs;
using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IAdminRepository
{
    Task<AdminDashboardDto> GetDashboardStatsAsync();
    Task<(IEnumerable<PendingClubDto> Items, int TotalCount)> GetPendingClubsAsync(int page, int pageSize);
    Task<Club?> GetClubByIdAsync(Guid clubId);
    Task UpdateClubAsync(Club club);
    Task<(IEnumerable<AdminUserDto> Items, int TotalCount)> GetUsersAsync(string? search, RoleType? role, int page, int pageSize);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task UpdateUserAsync(User user);
    Task<(IEnumerable<AdminJobAdDto> Items, int TotalCount)> GetJobAdsAsync(string? search, int page, int pageSize);
    Task DeleteJobAdAsync(Guid jobAdId);
}
