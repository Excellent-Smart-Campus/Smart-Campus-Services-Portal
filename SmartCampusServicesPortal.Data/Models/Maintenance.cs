using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class Maintenance
{
    public int? IssueId { get; set; }
    public int? StakeholderId { get; set; }
    public int? RoomId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Status StatusId { get; set; }
    public DateTime DateReported { get; set; }
    public DateTime? DateResolved { get; set; }
    public Notification  Notification {get; set; }
}