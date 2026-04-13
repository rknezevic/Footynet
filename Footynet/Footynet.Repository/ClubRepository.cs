using Microsoft.EntityFrameworkCore;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;

namespace Footynet.Repository;

public class ClubRepository : IClubRepository
{
    private readonly FootynetDbContext _context;

    public ClubRepository(FootynetDbContext context)
    {
        _context = context;
    }

    public async Task<Club?> GetByIdAsync(Guid id)
    {
        return await _context.Users.OfType<Club>()
            .Include(c => c.League)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Club> UpdateAsync(Club club)
    {
        _context.Users.Update(club);
        await _context.SaveChangesAsync();
        return club;
    }

    public async Task DeactivateAccountAsync(Guid clubId)
    {
        var club = await GetByIdAsync(clubId);
        if (club != null)
        {
            club.IsActive = false;
            await UpdateAsync(club);
        }
    }
}
