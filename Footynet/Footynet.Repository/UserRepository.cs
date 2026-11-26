using Microsoft.EntityFrameworkCore;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository.Interfaces;
using Footynet.Localization;

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
        var normalized = User.NormalizeEmail(email);
        return await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == normalized);
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
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.IsUniqueViolation())
        {
            // Two registrations with the same email at the same moment: the unique index catches the second
            throw new InvalidOperationException(AppMessages.Auth.EmailTaken);
        }
        return user;
    }

    public async Task<User?> GetByEmailConfirmationTokenHashAsync(string tokenHash)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.EmailConfirmationTokenHash == tokenHash);
    }

    public async Task<User?> GetByPasswordResetTokenHashAsync(string tokenHash)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.PasswordResetTokenHash == tokenHash);
    }

    public async Task<List<Admin>> GetActiveAdminsAsync()
    {
        return await _context.Users.OfType<Admin>().ToListAsync();
    }

    public async Task UpdateAsync(User user)
    {
        await _context.SaveChangesAsync();
    }
}