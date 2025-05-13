namespace SmartCampusServicesPortal.Data.Models;

public class Schedule
{
    public int TimetableId { get; set; }
    public int SubjectId { get; set; }
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public string Location { get; set; }
    public int RoomId { get; set; }
    public string RoomNumber { get; set; }
    public string RoomType { get; set; }
}