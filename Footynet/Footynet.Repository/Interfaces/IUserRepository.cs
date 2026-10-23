using Footynet.Models;

namespace Footynet.Repository.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(Guid id);
    Task<User> CreateAsync(User user);
    Task<User?> GetByEmailConfirmationTokenHashAsync(string tokenHash);
    Task UpdateAsync(User user);
}