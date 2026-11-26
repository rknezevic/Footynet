using System.Security.Claims;
using Footynet.DTOs;
using Footynet.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Footynet.Controllers;

// The user's email notification preferences (shown on the player and club profile pages)
[ApiController]
[Route("api/Profile/notifications")]
[Authorize(Roles = "Player,Club")]
public class NotificationSettingsController : ControllerBase
{
    private readonly IUserService _userService;

    public NotificationSettingsController(IUserService userService)
    {
        _userService = userService;
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<ActionResult<NotificationSettingsDto>> Get()
    {
        return Ok(await _userService.GetNotificationSettingsAsync(GetUserId()));
    }

    [HttpPut]
    public async Task<IActionResult> Update(NotificationSettingsDto dto)
    {
        await _userService.UpdateNotificationSettingsAsync(GetUserId(), dto);
        return NoContent();
    }
}
