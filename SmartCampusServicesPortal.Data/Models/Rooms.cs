namespace SmartCampusServicesPortal.Data.Models;

public class Rooms
{
    public int RoomId { get; set; }
    public string RoomNumber { get; set; }
    public int RoomTypeId { get; set; }
    public int Capacity { get; set; }
    public string Location { get; set; }
    public string RoomName { get; set; }
}