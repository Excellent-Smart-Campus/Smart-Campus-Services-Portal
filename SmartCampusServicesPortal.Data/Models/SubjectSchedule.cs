namespace SmartCampusServicesPortal.Data.Models;

public class SubjectSchedule
{
    public int TimetableId { get; set; }
    public int SubjectId { get; set; }
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Location { get; set; }
    public int DayOfWeekTypeId { get; set; }
    public string  DayOfWeekType { get; set; }
    public int RoomId { get; set; }
    public string RoomNumber { get; set; }
    public string RoomType { get; set; }
}