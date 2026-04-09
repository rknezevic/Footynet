using Footynet.Models;

namespace Footynet.Service.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}