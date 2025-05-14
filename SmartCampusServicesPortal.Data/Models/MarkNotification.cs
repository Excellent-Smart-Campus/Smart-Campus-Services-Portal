namespace SmartCampusServicesPortal.Data.Models;

public class MarkNotification
{
    public int? NotificationId { get; set; }
    public int SenderId { get; set; }
    public string Name { get; set; }
    public NotificationType NotificationTypeId { get; set; }
    public int? RelatedSubject { get; set; }
    public string Message { get; set; }
    public bool IsRead { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
    public Subject Subject { get; set; }
}