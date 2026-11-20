using Microsoft.AspNetCore.Mvc.Filters;

namespace Footynet.Filters;

// Keeps the page / pageSize query parameters of every list endpoint in a safe range:
// page 0 or less would give SQL a negative OFFSET (a 500), and pageSize=1000000 one very expensive query
public class PagingLimits : IActionFilter
{
    public const int MaxPageSize = 50;

    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ActionArguments.TryGetValue("page", out var page) && page is int p && p < 1)
            context.ActionArguments["page"] = 1;
        if (context.ActionArguments.TryGetValue("pageSize", out var size) && size is int s)
            context.ActionArguments["pageSize"] = Math.Clamp(s, 1, MaxPageSize);
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
