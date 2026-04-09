using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Footynet.DTOs;
using Footynet.Service.Interfaces;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Player")]
public class PlayerController : ControllerBase
{
    private readonly IPlayerService _playerService;

    public PlayerController(IPlayerService playerService)
    {
        _playerService = playerService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpPost("apply")]
    public async Task<IActionResult> ApplyToJob(CreateApplicationDto dto)
    {
        var application = await _playerService.ApplyToJobAsync(GetUserId(), dto);
        return Ok(new
        {
            application.Id,
            application.PlayerId,
            application.JobAdId,
            application.AppliedAt,
            Status = application.Status.ToString()
        });
    }

    [HttpGet("profile")]
    public async Task<ActionResult<PlayerProfileDto>> GetProfile()
    {
        var profile = await _playerService.GetPlayerProfileAsync(GetUserId());
        if (profile == null)
            return NotFound("Player profile not found");
        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<PlayerProfileDto>> UpdateProfile(UpdatePlayerProfileDto dto)
    {
        var profile = await _playerService.UpdatePlayerProfileAsync(GetUserId(), dto);
        return Ok(profile);
    }

    [HttpGet("applications")]
    public async Task<IActionResult> GetMyApplications([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _playerService.GetMyApplicationsAsync(GetUserId(), page, pageSize);
        return Ok(result);
    }

    [HttpDelete("applications/{applicationId}")]
    public async Task<IActionResult> CancelApplication(Guid applicationId)
    {
        await _playerService.CancelApplicationAsync(applicationId, GetUserId());
        return Ok();
    }

    [HttpDelete("account")]
    public async Task<IActionResult> DeactivateAccount()
    {
        await _playerService.DeactivateAccountAsync(GetUserId());
        return Ok();
    }
}
