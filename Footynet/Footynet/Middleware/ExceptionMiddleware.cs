using System.Net;
using System.Text.Json;
using Footynet.WebApi;
using Microsoft.Extensions.Localization;

namespace Footynet.Middleware;

// Thrown when an authenticated user tries something they are not allowed to do (403).
// UnauthorizedAccessException maps to 401, which makes the frontend log the user out.
public class ForbiddenException(string message) : Exception(message);

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IStringLocalizer<SharedResource> localizer)
    {
        _next = next;
        _logger = logger;
        _localizer = localizer;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            UnauthorizedAccessException ex => (HttpStatusCode.Unauthorized, ex.Message),
            ForbiddenException ex => (HttpStatusCode.Forbidden, ex.Message),
            InvalidOperationException ex => (HttpStatusCode.BadRequest, ex.Message),
            ArgumentException ex => (HttpStatusCode.BadRequest, ex.Message),
            KeyNotFoundException ex => (HttpStatusCode.NotFound, ex.Message),
            _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
        };

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);
        else
            _logger.LogWarning("Handled exception for {Method} {Path}: {Message}", context.Request.Method, context.Request.Path, exception.Message);

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            status = (int)statusCode,
            // Exception messages are written in English and used as keys for translation
            message = _localizer[message].Value
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
