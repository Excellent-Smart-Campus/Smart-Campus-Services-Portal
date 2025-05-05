using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class Stakeholder
{
    public int? StakeholderId { get; set; }
    public StakeholderType StakeholderTypeId { get; set; }
    public string Name { get; set; }
    public bool? IsDeleted { get; set; }
}