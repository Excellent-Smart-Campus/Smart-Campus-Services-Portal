using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class GroupAction
{
    public int GroupId { get; set; }
    public UserAction ActionId { get; set; }
    public string Action { get; set; }
}