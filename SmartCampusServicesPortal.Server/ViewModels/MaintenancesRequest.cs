using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class GetMaintenancesRequest
{
    public int? StakeholderId { get; set; }
    public Status?[] Statuses { get; set; }
}
