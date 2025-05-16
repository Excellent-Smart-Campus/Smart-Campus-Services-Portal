using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain.Manager;
using SmartCampusServicesPortal.Server.Extensions;
using SmartCampusServicesPortal.Server.Helper;
using SmartCampusServicesPortal.Server.Utils;
using SmartCampusServicesPortal.Server.ViewModels;

namespace SmartCampusServicesPortal.Server.Controller;

[ApiController]
[Route("/api/[controller]")]
[Authorize]
public class ServiceController : BaseController
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
            roomTypes.Add(RoomType.Lab1);
            roomTypes.Add(RoomType.Lab2);
            roomTypes.Add(RoomType.TechnicalLab);
            roomTypes.Add(RoomType.LectureHall);
        }

        if (stakeholderType == StakeholderType.Student)
        {
            roomTypes.Add(RoomType.StudyRoom);
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

        return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess });
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
            return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess });
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
            bookRoomRequest.ToBookARoom(GetStakeholderId(), room)
        );

        if (bookRoom.BookingId != null)
        {
            return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleSuccess });
        }

        return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
    }

    [HttpPost("getMaintenance")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Maintenance>> GetMaintenancesAsync([FromBody] GetMaintenancesRequest request)
    {
        return await _serviceManager.GetMaintenancesAsync(request.StakeholderId, request.Statuses);
    }

    [HttpPost("update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> MaintenanceUpdate([FromBody] MaintenanceUpdateVM model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (model.IssueId == 0)
        {
            return BadRequest(new { message = ErrorMessagesConstant.MaintenanceUpdateFail, success = false });
        }

        var dbMaintenance = await _serviceManager.GetMaintenancesByIdAsync(model.IssueId);

        if (dbMaintenance == null)
        {
            return NotFound(new { message = ErrorMessagesConstant.MaintenanceUpdateFail, success = false });
        }

        var rooms = (await GetRooms()).FirstOrDefault(r => r.RoomId == dbMaintenance.RoomId);
        var intitalStakeholder = await _stakeholderManager.GetUserProfile(dbMaintenance.StakeholderId.Value);

        var newMaintenace = dbMaintenance.ToMaintenanceUpdate((Status)model.Status, intitalStakeholder, rooms, GetStakeholderId());

        newMaintenace = await _serviceManager.CreateMaintenceBookingAsync(newMaintenace);

        if (!newMaintenace.StatusId.Equals((Status)model.Status))
        {
            return BadRequest(new { message = ErrorMessagesConstant.MaintenanceUpdateFail, success = false });
        }

        return Ok(new { success = true, message = ErrorMessagesConstant.MaintenanceUpdateSuccess });
    }

    [HttpGet("getNotificationsByStakeholder")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<MarkNotification>> GetStakeholderNotificationsAsync()
    {
        return await _serviceManager.GetStakeholderNotificationsAsync(GetStakeholderId());
    }

    [HttpGet("markNotificationsRead")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> MarkNotificationsRead()
    {
        var result = await _serviceManager.MarkNotificationsAsReadAsync(GetStakeholderId());

        if (!result) { return BadRequest(new { message = "Unable to read all notifications", success = false }); }
        
        return Ok(new { success = true, message = "Read all notifications successfully" });
    }

    [HttpGet("getStakeholderBookingById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Appointment>> GetStakeholderBookings()
    {
        return await _serviceManager.GetBookingForStakeholderAsync(GetStakeholderId());
    }

    [HttpGet("cancelBooking")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult>  CancelBooking([FromQuery] int bookingId)
    {
        if (bookingId == 0)
        {
            return BadRequest(new { message = ErrorMessagesConstant.BookingUpdateFail, success = false });
        }

        var dbBooking = await _serviceManager.GetBookingAsync(bookingId);

        if (dbBooking == null)
        {
            return NotFound(new { message = ErrorMessagesConstant.BookingUpdateFail, success = false });
        }

        var recipientIds = new List<int> {
            GetStakeholderId()
        };

        if (dbBooking.LecturerId.HasValue)
        {
            recipientIds.Add(dbBooking.StakeholderId.Value);
        }

        string recipientString = string.Join(",", recipientIds);

        dbBooking.StatusId = Status.Cancelled;
        dbBooking.Notification = new Notification
        {
            Message = $"Good day \n\n" +
                $"Please be informed that event has been cancelled by owner {GetName()}. \n\n" +
                $"Apologize for any inconvenience caused."
                ,
            SenderId = GetStakeholderId(),
            RecipientIds = recipientString,
            NotificationTypeId = dbBooking.LecturerId.HasValue ? NotificationType.Appointment : NotificationType.Booking
        };

        var newBooking = await _serviceManager.CreateAppointmentAsync(dbBooking);

        if (!newBooking.BookingId.Equals(bookingId))
        {
            return BadRequest(new { message = ErrorMessagesConstant.BookingUpdateFail, success = false });
        }

        return Ok(new { success = true, message = ErrorMessagesConstant.BookingUpdateSuccess });    
    }
    
    [HttpGet("confirmAppointmentBooking")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult>  ConfirmAppointmentBooking([FromQuery] int bookingId)
    {
        if (bookingId == 0)
        {
            return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
        }

        var dbBooking = await _serviceManager.GetBookingAsync(bookingId);

        if (dbBooking == null)
        {
            return NotFound(new { message = ErrorMessagesConstant.ScheduleError, success = false });
        }

        var recipientIds = new List<int> {
            GetStakeholderId(),
            dbBooking.StakeholderId.Value,
        };

        if (dbBooking.LecturerId.HasValue)
        {
            recipientIds.Add(dbBooking.StakeholderId.Value);
        }

        string recipientString = string.Join(",", recipientIds);

        var appointmentRequester = await _stakeholderManager.GetUserProfile(dbBooking.StakeholderId.Value);
        
        dbBooking.StatusId = Status.Cancelled;
        dbBooking.Notification = new Notification
        {
            Message = $"Dear {appointmentRequester.FirstName} {appointmentRequester.LastName} \n\n" +
                      $"Your request to meet with {GetName()}. has been approved \n\n" +
                      $"Please take note of the scheduled appointment details as reflected in the request notification. \n\n"+
                      $"Ensure that you arrive on time and come prepared with any necessary materials.\n\n" +
                      $"Should you be unable to attend, kindly inform us in advance.\n\n"
            ,
            SenderId = GetStakeholderId(),
            RecipientIds = recipientString,
            NotificationTypeId = NotificationType.Appointment
        };
        
        var newBooking = await _serviceManager.CreateAppointmentAsync(dbBooking);

        if (!newBooking.BookingId.Equals(bookingId))
        {
            return BadRequest(new { message = ErrorMessagesConstant.ScheduleError, success = false });
        }
        
        return Ok(new { success = true, message = ErrorMessagesConstant.ScheduleConfirmed });
    }
}