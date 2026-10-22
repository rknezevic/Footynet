using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Footynet.Models;
using Footynet.Service;
using Microsoft.Extensions.Configuration;

namespace Footynet.Tests.Services;

public class JwtServiceTests
{
    private readonly JwtService _service;

    public JwtServiceTests()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-key-that-is-long-enough-for-hmac-sha256",
                ["Jwt:Issuer"] = "Footynet",
                ["Jwt:Audience"] = "Footynet"
            })
            .Build();
        _service = new JwtService(configuration);
    }

    [Fact]
    public void GenerateToken_ContainsUserClaims()
    {
        var player = new Player { Id = Guid.NewGuid(), Email = "igrac@example.com" };

        var token = new JwtSecurityTokenHandler().ReadJwtToken(_service.GenerateToken(player));

        Assert.Equal(player.Id.ToString(), token.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal(player.Email, token.Claims.First(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal("Player", token.Claims.First(c => c.Type == ClaimTypes.Role).Value);
        Assert.Equal("Footynet", token.Issuer);
    }

    [Fact]
    public void GenerateToken_ExpiresInAbout24Hours()
    {
        var token = new JwtSecurityTokenHandler().ReadJwtToken(
            _service.GenerateToken(new Club { Id = Guid.NewGuid(), Email = "klub@example.com" }));

        var expectedExpiry = DateTime.UtcNow.AddHours(24);
        Assert.InRange(token.ValidTo, expectedExpiry.AddMinutes(-1), expectedExpiry.AddMinutes(1));
    }
}
