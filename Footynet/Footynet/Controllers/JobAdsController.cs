using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Footynet.DTOs;
using Footynet.Models;
using Footynet.Service.Interfaces;
using Footynet.Repository.Interfaces;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobAdsController : ControllerBase
{
    private readonly IJobAdService _jobAdService;

    public JobAdsController(IJobAdService jobAdService)
    {
        _jobAdService = jobAdService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JobAdDto>>> GetAds(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] PositionType? position = null, 
        [FromQuery] Guid? leagueId = null, 
        [FromQuery] Guid? countyId = null, 
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool sortDescending = true)
    {
        var excludePlayerId = User.IsInRole("Player") ? Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value) : (Guid?)null;
        var ads = await _jobAdService.GetAllAsync(page, pageSize, position, leagueId, countyId, searchTerm, excludePlayerId, sortDescending);
        return Ok(ads);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobAd(Guid id)
    {
        var ad = await _jobAdService.GetByIdAsync(id);
        if (ad == null)
            return NotFound();
        return Ok(new
        {
            ad.Id,
            ad.Title,
            ad.Description,
            ad.ClubId,
            RequiredPosition = ad.RequiredPosition.ToString(),
            ad.CreatedAt,
            ad.UpdatedAt,
            AdStatus = ad.AdStatus.ToString(),
            ClubName = ad.Club?.Name
        });
    }
}