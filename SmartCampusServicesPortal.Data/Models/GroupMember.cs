namespace SmartCampusServicesPortal.Data.Models;

public class GroupMember
{
    public int GroupId { get; set; }

    public string Description { get; set; }

    public int StakeholderId { get; set; }

    public string UserName { get; set; }

    public string Name { get; set; }
}