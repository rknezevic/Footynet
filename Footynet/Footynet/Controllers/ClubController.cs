using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Service.Interfaces;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Club")]
public class ClubController : ControllerBase
{
    private readonly IClubService _clubService;
    private readonly IJobAdService _jobAdService;
    private readonly IClubRepository _clubRepository;

    public ClubController(IClubService clubService, IJobAdService jobAdService, IClubRepository clubRepository)
    {
        _clubService = clubService;
        _jobAdService = jobAdService;
        _clubRepository = clubRepository;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    private async Task EnsureClubApproved()
    {
        var club = await _clubRepository.GetByIdAsync(GetUserId());
        if (club is not null && !club.IsApproved)
            throw new UnauthorizedAccessException("Your club account is pending approval");
    }

    [HttpPost("job-ads")]
    public async Task<IActionResult> CreateJobAd(CreateJobAdDto dto)
    {
        await EnsureClubApproved();
        var jobAd = await _jobAdService.CreateJobAdAsync(dto, GetUserId());
        return CreatedAtAction(nameof(CreateJobAd), new { id = jobAd.Id }, jobAd);
    }

    [HttpGet("job-ads")]
    public async Task<IActionResult> GetMyAds()
    {
        await EnsureClubApproved();
        var ads = await _jobAdService.GetByClubAsync(GetUserId());
        return Ok(ads);
    }

    [HttpPut("job-ads/{id}")]
    public async Task<IActionResult> UpdateJobAd(Guid id, CreateJobAdDto dto)
    {
        await EnsureClubApproved();
        var jobAd = await _jobAdService.UpdateJobAdAsync(id, dto, GetUserId());
        return Ok(jobAd);
    }

    [HttpPut("job-ads/{id}/close")]
    public async Task<IActionResult> CloseJobAd(Guid id)
    {
        await EnsureClubApproved();
        await _jobAdService.CloseJobAdAsync(id, GetUserId());
        return Ok();
    }

    [HttpPut("job-ads/{id}/reopen")]
    public async Task<IActionResult> ReopenJobAd(Guid id)
    {
        await EnsureClubApproved();
        await _jobAdService.ReopenJobAdAsync(id, GetUserId());
        return Ok();
    }

    [HttpGet("applications/{jobAdId}")]
    public async Task<IActionResult> GetApplications(
        Guid jobAdId,
        [FromQuery] StatusType? status = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        await EnsureClubApproved();
        var result = await _clubService.GetJobApplicationsAsync(jobAdId, status, page: page, pageSize: pageSize);
        return Ok(result);
    }

    [HttpPut("applications/{applicationId}/accept")]
    public async Task<IActionResult> AcceptApplication(Guid applicationId)
    {
        await EnsureClubApproved();
        await _clubService.AcceptApplicationAsync(applicationId, GetUserId());
        return Ok();
    }

    [HttpPut("applications/{applicationId}/reject")]
    public async Task<IActionResult> RejectApplication(Guid applicationId)
    {
        await EnsureClubApproved();
        await _clubService.RejectApplicationAsync(applicationId, GetUserId());
        return Ok();
    }

    [HttpGet("applications/{jobAdId}/count")]
    public async Task<ActionResult<int>> GetApplicationCount(Guid jobAdId)
    {
        await EnsureClubApproved();
        var count = await _clubService.GetApplicationCountAsync(jobAdId);
        return Ok(count);
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ClubProfileDto>> GetProfile()
    {
        await EnsureClubApproved();
        var profile = await _clubService.GetClubProfileAsync(GetUserId());
        if (profile == null)
            return NotFound("Club profile not found");
        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateClubProfileDto dto)
    {
        await EnsureClubApproved();
        await _clubService.UpdateClubProfileAsync(GetUserId(), dto);
        return Ok();
    }

    [HttpDelete("account")]
    public async Task<IActionResult> DeactivateAccount()
    {
        await EnsureClubApproved();
        await _clubService.DeactivateAccountAsync(GetUserId());
        return Ok();
    }
}
