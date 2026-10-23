using Footynet.Localization;
using Footynet.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly string _accessToken;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public LocationController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IStringLocalizer<SharedResource> localizer)
    {
        _localizer = localizer;
        _httpClient = httpClientFactory.CreateClient();
        _accessToken = configuration["Mapbox:AccessToken"] ?? string.Empty;
    }

    private bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_accessToken) && !_accessToken.StartsWith("YOUR_");

    private IActionResult NotConfigured() =>
        StatusCode(StatusCodes.Status503ServiceUnavailable,
            new { message = _localizer[AppMessages.General.LocationNotConfigured].Value, code = AppMessages.General.LocationNotConfigured });

    [HttpGet("suggest")]
    public async Task<IActionResult> Suggest([FromQuery] string q, [FromQuery] string? sessionToken = null)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return Ok(new { suggestions = Array.Empty<object>() });
        if (!IsConfigured)
            return NotConfigured();

        var token = sessionToken ?? Guid.NewGuid().ToString();
        var url = $"https://api.mapbox.com/search/searchbox/v1/suggest?q={Uri.EscapeDataString(q)}" +
            $"&types=place&country=HR&language=hr&session_token={token}&access_token={_accessToken}";
        var response = await _httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();
        return Content(content, "application/json");
    }

    [HttpGet("retrieve/{mapboxId}")]
    public async Task<IActionResult> Retrieve(string mapboxId, [FromQuery] string? sessionToken = null)
    {
        if (!IsConfigured)
            return NotConfigured();

        var token = sessionToken ?? Guid.NewGuid().ToString();
        var url = $"https://api.mapbox.com/search/searchbox/v1/retrieve/{Uri.EscapeDataString(mapboxId)}?language=hr&session_token={token}&access_token={_accessToken}";
        var response = await _httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();
        return Content(content, "application/json");
    }
}
