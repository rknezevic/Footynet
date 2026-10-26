using System.Threading.RateLimiting;
using Footynet.Localization;
using Footynet.Model;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Localization;

namespace Footynet.Security;

// Per-IP limits for the public auth endpoints: slows down password guessing and stops anyone from
// using register / forgot-password to spam emails (and burn through the SMTP provider's daily quota)
public static class RateLimits
{
    // Login, email confirmation, password reset, email check
    public const string Auth = "auth";
    // Endpoints that send an email: registration, resend confirmation, forgot password
    public const string SendsEmail = "sends-email";

    public static IServiceCollection AddFootynetRateLimits(this IServiceCollection services)
    {
        // Behind the hosting proxy every request comes from the proxy's address; take the client's
        // address from X-Forwarded-For. ForwardLimit stays 1, so only the entry the proxy itself
        // appended is used and a client can't pick its own address by sending the header.
        services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownNetworks.Clear();
            options.KnownProxies.Clear();
        });

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy(Auth, context => PerIp(context, permits: 10, TimeSpan.FromMinutes(1)));
            options.AddPolicy(SendsEmail, context => PerIp(context, permits: 5, TimeSpan.FromMinutes(15)));

            // Same { status, message, code } shape as ExceptionMiddleware, translated
            options.OnRejected = async (context, cancellationToken) =>
            {
                var response = context.HttpContext.Response;
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();

                var localizer = context.HttpContext.RequestServices.GetRequiredService<IStringLocalizer<SharedResource>>();
                await response.WriteAsJsonAsync(new
                {
                    status = StatusCodes.Status429TooManyRequests,
                    message = localizer[AppMessages.General.TooManyRequests].Value,
                    code = AppMessages.General.TooManyRequests
                }, cancellationToken);
            };
        });

        return services;
    }

    private static RateLimitPartition<string> PerIp(HttpContext context, int permits, TimeSpan window) =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions { PermitLimit = permits, Window = window, QueueLimit = 0 });
}
