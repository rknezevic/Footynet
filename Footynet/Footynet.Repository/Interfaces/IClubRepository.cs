using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IClubRepository
{
    Task<Club?> GetByIdAsync(Guid id);
    Task<Club> UpdateAsync(Club club);
    Task DeactivateAccountAsync(Guid clubId);
}
