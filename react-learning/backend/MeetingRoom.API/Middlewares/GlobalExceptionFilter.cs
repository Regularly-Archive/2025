using MeetingRoom.API.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace MeetingRoom.API.Middlewares;

public class GlobalExceptionFilter : IActionFilter, IOrderedFilter
{
    ILogger<GlobalExceptionFilter> _logger;
    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }

    public int Order => int.MaxValue - 10;

    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception != null)
        {
            _logger.LogError(context.Exception, string.Empty);
            context.Result = ApiResult.Failure(context.Exception);
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.ExceptionHandled = true;
        }
    }
}
