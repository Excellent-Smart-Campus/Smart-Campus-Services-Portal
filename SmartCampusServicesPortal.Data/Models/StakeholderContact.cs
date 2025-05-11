using SmartCampusServicesPortal.Data.Enums;
namespace SmartCampusServicesPortal.Data.Models;


public class StakeholderContact
{
    public int? ContactId { get; set; }
    public int? StakeholderId { get; set; }
    public ContactType ContactTypeId { get; set; }
    public string Detail { get; set; }
    public string AreaCode { get; set; }
}