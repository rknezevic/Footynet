using Microsoft.AspNetCore.Mvc;
using Footynet.DTOs;
using Footynet.Service.Interfaces;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        var response = await _userService.RegisterAsync(dto);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var response = await _userService.LoginAsync(dto);
        return Ok(response);
    }

    [HttpGet("check-email")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);
        return Ok(new { exists = user != null });
    }
}
