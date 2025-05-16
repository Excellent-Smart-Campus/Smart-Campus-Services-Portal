using System.ComponentModel.DataAnnotations;
using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class MaintenanceUpdateVM
{

    [Required]
    public int IssueId { get; set; }
    
    [Required]
    public int Status { get; set; }
 
}