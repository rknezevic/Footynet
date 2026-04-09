using Microsoft.EntityFrameworkCore;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;

namespace Footynet.Repository;

public class UserRepository : IUserRepository
{
    private readonly FootynetDbContext _context;

    public UserRepository(FootynetDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> CreateAsync(User user)
    {
        user.Id = Guid.NewGuid();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}