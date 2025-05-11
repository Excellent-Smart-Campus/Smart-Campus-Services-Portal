using System.ComponentModel.DataAnnotations;

namespace SmartCampusServicesPortal.Server.ViewModels;

public class LockUser
{ 
   [Required]
   public int  Stakeholder { get; set; }
   
   [Required]
   public bool IsLocked { get; set;  }
}