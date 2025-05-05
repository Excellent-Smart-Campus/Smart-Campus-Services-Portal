using System.ComponentModel.DataAnnotations;
namespace SmartCampusServicesPortal.Server.ViewModels;

public class ProfileVM
{
    public int? TitleId { get; set; }
    
    [Required(ErrorMessage = "First Name is required")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last Name is required")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Mobile Number is required.")]
    public string MobileNumber { get; set; }
}