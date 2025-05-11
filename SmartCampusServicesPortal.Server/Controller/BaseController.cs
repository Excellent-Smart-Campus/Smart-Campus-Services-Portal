using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Enums;
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
    
    protected StakeholderType GetStakeholderType()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var stakeholderIdClaim = User.FindFirst(CustomClaims.StakeholderTypeId)?.Value;

        if (string.IsNullOrEmpty(stakeholderIdClaim))
        {
            throw new InvalidOperationException("Stakeholder type claim is missing.");
        }

        if (!Enum.TryParse<StakeholderType>(stakeholderIdClaim, out var stakeholderType))
        {
            throw new InvalidOperationException("Stakeholder type claim is not a valid stakeholder type.");
        }
        
        return stakeholderType;
    } 
    
    protected string GetName()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var stakeholderNameClaim = User.FindFirst(CustomClaims.Name)?.Value;

        if (string.IsNullOrEmpty(stakeholderNameClaim))
        {
            throw new InvalidOperationException("Stakeholder Name claim is missing.");
        }
        
        return stakeholderNameClaim;
    } 

}