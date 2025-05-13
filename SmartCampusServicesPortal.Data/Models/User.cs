namespace SmartCampusServicesPortal.Data.Models;

public class User
{
    public int StakeholderId { get; set; }
    public string DisplayName { get; set; }
    public string Username { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsLocked { get; set; }
    public string Groups { get; set; }
}