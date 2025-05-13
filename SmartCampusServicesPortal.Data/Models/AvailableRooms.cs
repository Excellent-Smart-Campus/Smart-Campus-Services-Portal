namespace SmartCampusServicesPortal.Data.Models;

public class AvailableRooms
{
    public int RoomId { get; set; }
    public string RoomNumber { get; set; }
    public int RoomTypeId { get; set; }
    public string RoomName { get; set; }
    public int Capacity { get; set; }
    public string Location { get; set; }
    public DateTime BookingDate { get; set; }
    public TimeOnly SlotStart { get; set; }
    public TimeOnly SlotEnd { get; set; }
    public bool IsAvailable { get; set; }
}