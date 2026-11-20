using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Footynet.Repository;

public static class DbUpdateExceptionExtensions
{
    // True when PostgreSQL rejected the write because of a unique index
    public static bool IsUniqueViolation(this DbUpdateException exception) =>
        exception.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation };
}
