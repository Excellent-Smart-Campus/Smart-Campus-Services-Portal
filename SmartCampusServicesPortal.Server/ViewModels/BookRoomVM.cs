namespace SmartCampusServicesPortal.Server.ViewModels;

public class BookRoomVM
{
    public int Room { get; set; }
    public string Purpose { get; set; }
    public DateTime BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}