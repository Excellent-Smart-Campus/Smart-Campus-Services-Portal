using System.ComponentModel.DataAnnotations;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class LoginVM
{
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; }

    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; }
}