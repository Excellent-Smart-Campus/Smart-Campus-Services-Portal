using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class ContactsVM
{
    public int? ContactId { get; set; }
    public ContactType ContactType { get; set; }
    public string Detail { get; set; }
}