namespace SmartCampusServicesPortal.Server.ViewModels;

public class AppointmentSchedule
{
    public int Lecturer { get; set; }
    public string Purpose { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan StartTime { get; set; }
}