using System.ComponentModel.DataAnnotations;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Server.Validations;
namespace SmartCampusServicesPortal.Server.ViewModels;

public class RegisterVM
{
    //User details
    [Required(ErrorMessage = "Title is required")]
    public int Title { get; set; }
    
    [Required(ErrorMessage = "First Name is required")]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "Last Name is required")]
    public string LastName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email address.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [DataType(DataType.Password)]
    [PasswordValidation]
    public string Password { get; set; }

    [Required(ErrorMessage = "Confirm Password is required.")]
    [DataType(DataType.Password)]
    [ComparePasswords(nameof(Password))]
    public string ConfirmPassword { get; set; }
    
    [Required(ErrorMessage = "Mobile Number is required.")]
    public string MobileNumber { get; set; }
    
    [Required(ErrorMessage = "Subjects is required.")]
    public List<int> Subjects { get; set; }
    
    [Required(ErrorMessage = "Course is required.")]
    public int Course { get; set; }
}