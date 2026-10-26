using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Footynet.DTOs;
using Footynet.Security;
using Footynet.Service.Interfaces;

namespace Footynet.Controllers;

// Every endpoint here is limited per IP address (see RateLimits); the ones that send an email more strictly
[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting(RateLimits.Auth)]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    [EnableRateLimiting(RateLimits.SendsEmail)]
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

    [HttpPost("verify-email")]
    public async Task<ActionResult<AuthResponseDto>> VerifyEmail(VerifyEmailDto dto)
    {
        return Ok(await _userService.VerifyEmailAsync(dto.Token));
    }

    [HttpPost("resend-verification")]
    [EnableRateLimiting(RateLimits.SendsEmail)]
    public async Task<IActionResult> ResendVerification(ResendVerificationDto dto)
    {
        await _userService.ResendConfirmationAsync(dto.Email);
        return NoContent();
    }

    [HttpPost("forgot-password")]
    [EnableRateLimiting(RateLimits.SendsEmail)]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
    {
        await _userService.ForgotPasswordAsync(dto.Email);
        return NoContent();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        await _userService.ResetPasswordAsync(dto);
        return NoContent();
    }

    [HttpGet("check-email")]
    [Microsoft.AspNetCore.Authorization.AllowAnonymous]
    public async Task<IActionResult> CheckEmail([FromQuery] string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);
        return Ok(new { exists = user != null });
    }
}
