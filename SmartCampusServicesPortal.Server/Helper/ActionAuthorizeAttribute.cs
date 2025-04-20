using SmartCampusServicesPortal.Domain.Constants;
using SmartCampusServicesPortal.Data.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace SmartCampusServicesPortal.Server.Helper;

public class ActionAuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly UserAction _requiredAction;

    public ActionAuthorizeAttribute(UserAction requiredAction)
    {
        _requiredAction = requiredAction;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var userClaims = context.HttpContext.User.Claims;

        if (!context.HttpContext.User.Claims
                .Any(c => c.Type == CustomClaims.GroupAction && c.Value == _requiredAction.ToString()))
        {
            context.Result = new ForbidResult();
        }
    }
}