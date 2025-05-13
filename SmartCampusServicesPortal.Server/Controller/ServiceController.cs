using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain.Manager;
using SmartCampusServicesPortal.Server.Extentions;
using SmartCampusServicesPortal.Server.Helper;
using SmartCampusServicesPortal.Server.Utils;
using SmartCampusServicesPortal.Server.ViewModels;

namespace SmartCampusServicesPortal.Server.Controller;

[ApiController]
[Route("/api/[controller]")]
[Authorize]
public class ServiceController: BaseController
{
    private readonly StakeholderManager _stakeholderManager;
    private readonly ServiceManager _serviceManager;

    public ServiceController(StakeholderManager stakeholderManager, ServiceManager serviceManager)
    {
        _stakeholderManager = stakeholderManager;
        _serviceManager = serviceManager;
    }
    
    [HttpPost("availableBooking", Name = "getAvailableBookings")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<AvailableRooms>> GetAvailableBooking([FromBody] RoomAvailability roomAvailability)
    {
        var stakeholderType = GetStakeholderType();
        var roomTypes = new List<RoomType?>();
        if (stakeholderType == StakeholderType.Lecture)
        {
            roomTypes.Add(RoomType.Lab1 );
            roomTypes.Add(RoomType.Lab2 );
            roomTypes.Add(RoomType.TechnicalLab );
            roomTypes.Add(RoomType.LectureHall );
        }

        if (stakeholderType == StakeholderType.Student)
        {
            roomTypes.Add(RoomType.StudyRoom );
        }
        
        return await _serviceManager.GetAvailableRoomsAsync(
            roomAvailability.Year, roomAvailability.Month, roomTypes.ToArray());
    }
    
    [HttpGet("getRooms")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Rooms>> GetRooms()
    {
        return await _serviceManager.GetAllRoomsAsync();
    }
    
    [ActionAuthorize(UserAction.ReportMaintenanceIssue)]
    [HttpPost("maintenanceRequest")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateMaintenanceRequest([FromBody] MaintenanceVM maintenanceVM)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var rooms = (await GetRooms()).FirstOrDefault(r => r.RoomId == maintenanceVM.Room);
        
        var bookMaintenance = await _serviceManager.CreateMaintenceBookingAsync(
            maintenanceVM.ToMaintenance(GetStakeholderId(), GetStakeholderType(), rooms)
        );

        if (bookMaintenance.IssueId == null)
        {
            return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
        }

        return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess} );
    }

    [HttpPost("scheduleAppointment")]
    [ActionAuthorize(UserAction.ScheduleAppointmentNotification)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateLecturerAppointment([FromBody] AppointmentSchedule appointmentSchedule)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var lecturer = await _stakeholderManager.GetUserProfile(appointmentSchedule.Lecturer);
        
        var bookAppointment = await _serviceManager.CreateAppointmentAsync(
            appointmentSchedule.ToScheduleAppointment(GetStakeholderId(), GetName(), lecturer)
        );

        if (bookAppointment.BookingId != null)
        {
            return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess} );
        }
        return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
    }
    
    [HttpPost("bookARoom")]
    [ActionAuthorize(UserAction.BookARoom)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> BookARoom([FromBody] BookRoomVM bookRoomRequest)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var room = (await GetRooms()).FirstOrDefault(r => r.RoomId == bookRoomRequest.Room);

        var bookRoom = await _serviceManager.CreateAppointmentAsync(
            bookRoomRequest.ToBookARoom(GetStakeholderId(), GetStakeholderType(), GetName(), room)
        );

        if (bookRoom.BookingId != null)
        {
            return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess} );
        }
        
        return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
    }


    [HttpGet("getMaintenance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Maintenance>> GetMaintenancesAsync(
        [FromQuery] int? stakeholderId,
        [FromQuery] Status?[] statuses = null)
    {
        return await _serviceManager.GetMaintenancesAsync(stakeholderId, statuses);
    }
}