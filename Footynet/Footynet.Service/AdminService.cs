using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;
using Footynet.Localization;
using Footynet.Service.Email;
using Microsoft.Extensions.Options;

namespace Footynet.Service;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;
    private readonly IEmailQueue _emailQueue;
    private readonly AppOptions _appOptions;

    public AdminService(IAdminRepository adminRepository, IEmailQueue emailQueue, IOptions<AppOptions> appOptions)
    {
        _adminRepository = adminRepository;
        _emailQueue = emailQueue;
        _appOptions = appOptions.Value;
    }

    private void SendClubDecision(Club club, bool approved) =>
        _emailQueue.Enqueue(EmailTemplates.ClubDecision(club.Email, club.PreferredLanguage, club.Name, approved,
            $"{_appOptions.FrontendUrl.TrimEnd('/')}/login"));

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
            throw new KeyNotFoundException(AppMessages.Club.NotFound);

        if (club.IsApproved)
            throw new InvalidOperationException(AppMessages.Club.AlreadyApproved);

        club.IsApproved = true;
        await _adminRepository.UpdateClubAsync(club);
        SendClubDecision(club, approved: true);
    }

    public async Task RejectClubAsync(Guid clubId)
    {
        var club = await _adminRepository.GetClubByIdAsync(clubId);
        if (club == null)
            throw new KeyNotFoundException(AppMessages.Club.NotFound);

        if (!club.IsActive || club.IsApproved)
            throw new InvalidOperationException(AppMessages.Club.NotPending);

        club.IsActive = false;
        await _adminRepository.UpdateClubAsync(club);
        SendClubDecision(club, approved: false);
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
            throw new InvalidOperationException(AppMessages.User.CannotDeactivateSelf);

        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException(AppMessages.User.NotFound);

        if (!user.IsActive)
            throw new InvalidOperationException(AppMessages.User.AlreadyDeactivated);

        user.IsActive = false;
        await _adminRepository.UpdateUserAsync(user);
    }

    public async Task ReactivateUserAsync(Guid userId)
    {
        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null)
            throw new KeyNotFoundException(AppMessages.User.NotFound);

        if (user.IsActive)
            throw new InvalidOperationException(AppMessages.User.AlreadyActive);

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
        if (!await _adminRepository.DeleteJobAdAsync(jobAdId))
            throw new KeyNotFoundException(AppMessages.JobAd.NotFound);
    }
}
