namespace SmartCampusServicesPortal.Data.Models;

public class StakeholderPerson
{
    public int? StakeholderId { get; set; }
    public int? TitleId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public bool IsLocked { get; set; }
    public bool IsDeleted { get; set; }
    public List<StakeholderContact> Contacts { get; set; }
    public List<Course> Courses { get; set; } = new();
}