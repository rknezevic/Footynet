using System.Net;
using System.Text.Json;
using Footynet.Exceptions;
using Footynet.Localization;
using Footynet.Model;
using Microsoft.Extensions.Localization;

namespace Footynet.Middleware;

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
            _ => (HttpStatusCode.InternalServerError, AppMessages.General.Unexpected)
        };

        if (statusCode == HttpStatusCode.InternalServerError)
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);
        else
            _logger.LogWarning("Handled exception for {Method} {Path}: {Message}", context.Request.Method, context.Request.Path, exception.Message);

        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var localized = _localizer[message];
        var response = new
        {
            status = (int)statusCode,
            // App exceptions carry an AppMessages key; it is translated for the user and also returned
            // as "code" so the frontend can react to specific errors. Other exceptions (e.g. thrown by
            // the framework) have no resource entry and are passed through without a code.
            message = localized.Value,
            code = localized.ResourceNotFound ? null : message
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
