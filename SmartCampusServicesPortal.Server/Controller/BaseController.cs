using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Domain.Constants;

namespace SmartCampusServicesPortal.Server.Controller;

public class BaseController: ControllerBase
{
    protected int GetStakeholderId()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var stakeholderIdClaim = User.FindFirst(CustomClaims.StakeholderId)?.Value;

        if (string.IsNullOrEmpty(stakeholderIdClaim))
        {
            throw new InvalidOperationException("StakeholderId claim is missing.");
        }

        if (!int.TryParse(stakeholderIdClaim, out var stakeholderId))
        {
            throw new InvalidOperationException("StakeholderId claim is not a valid integer.");
        }

        return stakeholderId;

    } 

}