using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class Notification
{
    public int? NotificationId { get; set; }
    public int SenderId { get; set; }
    public NotificationType NotificationTypeId { get; set; }
    public int? SubjectId { get; set; }
    public string Message { get; set; }
    public string Description { get; set; }
    public int? ReferenceId { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
    public string RecipientIds {get; set; }
}