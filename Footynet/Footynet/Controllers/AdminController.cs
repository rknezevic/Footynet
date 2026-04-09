using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Service.Interfaces;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
    {
        var dashboard = await _adminService.GetDashboardAsync();
        return Ok(dashboard);
    }

    [HttpGet("clubs/pending")]
    public async Task<ActionResult<PaginatedResult<PendingClubDto>>> GetPendingClubs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _adminService.GetPendingClubsAsync(page, pageSize);
        return Ok(result);
    }

    [HttpPut("clubs/{id}/approve")]
    public async Task<IActionResult> ApproveClub(Guid id)
    {
        await _adminService.ApproveClubAsync(id);
        return Ok();
    }

    [HttpPut("clubs/{id}/reject")]
    public async Task<IActionResult> RejectClub(Guid id)
    {
        await _adminService.RejectClubAsync(id);
        return Ok();
    }

    [HttpGet("users")]
    public async Task<ActionResult<PaginatedResult<AdminUserDto>>> GetUsers(
        [FromQuery] string? search = null,
        [FromQuery] RoleType? role = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _adminService.GetUsersAsync(search, role, page, pageSize);
        return Ok(result);
    }

    [HttpPut("users/{id}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid id)
    {
        await _adminService.DeactivateUserAsync(id, GetUserId());
        return Ok();
    }

    [HttpPut("users/{id}/reactivate")]
    public async Task<IActionResult> ReactivateUser(Guid id)
    {
        await _adminService.ReactivateUserAsync(id);
        return Ok();
    }

    [HttpGet("job-ads")]
    public async Task<ActionResult<PaginatedResult<AdminJobAdDto>>> GetJobAds(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _adminService.GetJobAdsAsync(search, page, pageSize);
        return Ok(result);
    }

    [HttpDelete("job-ads/{id}")]
    public async Task<IActionResult> DeleteJobAd(Guid id)
    {
        await _adminService.DeleteJobAdAsync(id);
        return Ok();
    }
}
