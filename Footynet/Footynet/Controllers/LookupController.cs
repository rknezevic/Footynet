using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Footynet.Data;
using Footynet.Models;

namespace Footynet.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly FootynetDbContext _context;

    public LookupController(FootynetDbContext context)
    {
        _context = context;
    }

    [HttpGet("counties")]
    public async Task<ActionResult<IEnumerable<object>>> GetCounties()
    {
        var counties = await _context.Counties
            .Select(c => new { c.Id, c.Name })
            .ToListAsync();
        return Ok(counties);
    }

    [HttpGet("leagues")]
    public async Task<ActionResult<IEnumerable<object>>> GetLeagues()
    {
        var leagues = await _context.Leagues
            .Select(l => new { l.Id, l.Name })
            .ToListAsync();
        return Ok(leagues);
    }

    [HttpGet("positions")]
    public ActionResult<IEnumerable<object>> GetPositions()
    {
        var positions = Enum.GetValues<PositionType>()
            .Select(p => new { Id = (int)p, Name = p.ToString() });
        return Ok(positions);
    }
}
