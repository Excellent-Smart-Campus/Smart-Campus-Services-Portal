namespace SmartCampusServicesPortal.Data.Models;

public class TimeTable
{
    public int CourseId { get; set; }
    public string CourseCode { get; set; }
    public List<SubjectSchedule> SubjectSchedules { get; set; }
}