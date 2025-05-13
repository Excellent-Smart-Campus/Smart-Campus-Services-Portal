using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class Appointment
{
    public int? BookingId { get; set; }
    public int? StakeholderId { get; set; }
    public int? LecturerId { get; set; }
    public int? RoomId { get; set; }
    public string Purpose { get; set; }
    public DateTime BookingDate { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public Status StatusId { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
    public Notification? Notification {get; set; }
}