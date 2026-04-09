using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

namespace Footynet.Service;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;

    public AdminService(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public async Task<AdminDashboardDto> GetDashboardAsync()
    {
        return await _adminRepository.GetDashboardStatsAsync();
    }

    public async Task<PaginatedResult<PendingClubDto>> GetPendingClubsAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _adminRepository.GetPendingClubsAsync(page, pageSize);
        return new PaginatedResult<PendingClubDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task ApproveClubAsync(Guid clubId)
    {
        var club = await _adminRepository.GetClubByIdAsync(clubId);
        if (club == null)
            throw new KeyNotFoundException("Club not found");

        if (club.IsApproved)
            throw new InvalidOperationException("Club is already approved");

        club.IsApproved = true;
        await _adminRepository.UpdateClubAsync(club);
    }

    public async Task RejectClubAsync(Guid clubId)
    {
        var club = await _adminRepository.GetClubByIdAsync(clubId);
        if (club == null)
            throw new KeyNotFoundException("Club not found");

        if (!club.IsActive || club.IsApproved)
            throw new InvalidOperationException("Club is not in pending state");

        club.IsActive = false;
        await _adminRepository.UpdateClubAsync(club);
    }

    public async Task<PaginatedResult<AdminUserDto>> GetUsersAsync(string? search, RoleType? role, int page, int pageSize)
    {
        var (items, totalCount) = await _adminRepository.GetUsersAsync(search, role, page, pageSize);
        return new PaginatedResult<AdminUserDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task DeactivateUserAsync(Guid userId, Guid adminId)
    {
        if (userId == adminId)
            throw new InvalidOperationException("Cannot deactivate your own account");

        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        if (!user.IsActive)
            throw new InvalidOperationException("User is already deactivated");

        user.IsActive = false;
        await _adminRepository.UpdateUserAsync(user);
    }

    public async Task ReactivateUserAsync(Guid userId)
    {
        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        if (user.IsActive)
            throw new InvalidOperationException("User is already active");

        user.IsActive = true;
        await _adminRepository.UpdateUserAsync(user);
    }

    public async Task<PaginatedResult<AdminJobAdDto>> GetJobAdsAsync(string? search, int page, int pageSize)
    {
        var (items, totalCount) = await _adminRepository.GetJobAdsAsync(search, page, pageSize);
        return new PaginatedResult<AdminJobAdDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task DeleteJobAdAsync(Guid jobAdId)
    {
        // Repository's DeleteJobAdAsync silently no-ops if not found,
        // but we need to throw per the error handling spec.
        // Use GetJobAdsAsync to verify existence first.
        var (items, _) = await _adminRepository.GetJobAdsAsync(null, 1, int.MaxValue);
        if (!items.Any(j => j.Id == jobAdId))
            throw new KeyNotFoundException("Job ad not found");

        await _adminRepository.DeleteJobAdAsync(jobAdId);
    }
}
