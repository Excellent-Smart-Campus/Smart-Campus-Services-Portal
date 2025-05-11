using System.ComponentModel.DataAnnotations;
namespace SmartCampusServicesPortal.Server.ViewModels;

public class ProfileVM
{
    public int? Title { get; set; }
    
    public string FirstName { get; set; }
    
    public string LastName { get; set; }
    
    public List<ContactsVM>  Contacts { get; set; }
}