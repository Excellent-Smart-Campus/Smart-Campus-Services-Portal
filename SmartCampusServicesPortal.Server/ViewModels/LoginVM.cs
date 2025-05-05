using System.ComponentModel.DataAnnotations;
using SmartCampusServicesPortal.Server.Validations;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class LoginVM
{
    [Required(ErrorMessage = "Password is required")]
    [PasswordValidation]
    public string Password { get; set; }

    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; }
}