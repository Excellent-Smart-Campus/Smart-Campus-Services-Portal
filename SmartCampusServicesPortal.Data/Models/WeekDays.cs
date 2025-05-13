namespace SmartCampusServicesPortal.Data.Models;

public class WeekDays
{
    public int DayOfWeekTypeId { get; set; }
    public string  DayOfWeekType { get; set; }
    
    public List<Schedule> Schedules { get; set; } = new List<Schedule>();
}