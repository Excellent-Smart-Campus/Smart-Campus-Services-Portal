using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Server.ViewModels;
using NotificationType = SmartCampusServicesPortal.Data.Models.NotificationType;

namespace SmartCampusServicesPortal.Server.Extentions;

public static class ModelExtention
{
    public static Stakeholder ToStakeHolderUser(this RegisterVM registerVM)
    {
        var stakeholder = new Stakeholder
        {
            Name = $"{registerVM.FirstName} {registerVM.LastName}",
            StakeholderTypeId = StakeholderType.Student,
        };

        return stakeholder;
    }
    public static StakeholderPerson ToPerson(this RegisterVM registerVM)
    {
        var person = new StakeholderPerson
        {
            FirstName = registerVM.FirstName,
            LastName = registerVM.LastName,
            TitleId = registerVM.Title,
        };

        return person;
    }
    public static List<StakeholderContact> ToContacts(this RegisterVM registerVM)
    {
        var contacts = new List<StakeholderContact>();

        if (!string.IsNullOrEmpty(registerVM.MobileNumber))
        {
            contacts.Add(new StakeholderContact
            {
                Detail = registerVM.MobileNumber,
                ContactTypeId = ContactType.CellPhone,
            });
        }

        if (!string.IsNullOrEmpty(registerVM.Email))
        {
            contacts.Add(new StakeholderContact
            {
                Detail = registerVM.Email.ToLower(),
                ContactTypeId = ContactType.Email
            });
        }

        return contacts;
    }
    public static StakeholderRelationship ToRelatedStakeholder(this RegisterVM registerVM)
    {
        var stakeholderRelated = new StakeholderRelationship()
        {
            RelatedStakeholderId = registerVM.Course,
            StakeholderRelationshipTypeId = StakeholderRelationshipType.Enrolled
        };
        
        return stakeholderRelated;
    }
    public static ApplicationUser ToUSer(this RegisterVM registerVM)
    {
        return new ApplicationUser
        {
            UserName = registerVM.Email.ToLower(),
        };
    }

    public static Maintenance ToMaintenance(this MaintenanceVM maintenanceVM, int stakeholder,
        StakeholderType stakeholderType, Rooms room)
    {
        var recipientIds = new List<int> { stakeholder };
        
        string recipientString = string.Join(",", recipientIds);
        
        var maintenance = new Maintenance
        {
            RoomId = maintenanceVM.Room,
            Description = maintenanceVM.Description,
            Title = maintenanceVM.Name,
            StakeholderId = stakeholder,
            StatusId = Status.Open,
            Notification = new Notification
            {
                Message = 
                    $"Dear Staff, " +
                    $" "+
                    $"A maintenance request has been submitted for {room.RoomName}** by a {stakeholderType}." +
                    $"Issue Description: "+
                    $" "+
                    $"{maintenanceVM.Description}" +
                    $" "+
                    $"Please review and take the necessary action at your earliest convenience.",
                SenderId = stakeholder,
                RecipientIds = recipientString,
                NotificationTypeId = NotificationType.Maintenance  
            }
        };
        return maintenance;
    }

    public static Maintenance ToMaintenanceUpdate(this Maintenance dbMaintenance, Status status, 
        StakeholderPerson person, Rooms room, int stakeholder){
        
        var recipientIds = new List<int> { dbMaintenance.StakeholderId.Value, stakeholder};
        string recipientString = string.Join(",", recipientIds);
        
        var maintenance = new Maintenance
        {
            RoomId = dbMaintenance.RoomId,
            Description = dbMaintenance.Description,
            Title = dbMaintenance.Title,
            StakeholderId = dbMaintenance.StakeholderId,
            StatusId = status,
            DateReported = dbMaintenance.DateReported,
            IssueId = dbMaintenance.IssueId,
            Notification = new Notification
            {
                Message = 
                    $"Dear {person.FirstName} {person.LastName}, " +
                    $" "+
                    $"The maintenance request for {room.RoomName} has been updated by Admin staff." +
                    $" "+
                    $"Current Status: {status}" +
                    $" "+
                    $"Thank you for your patience.",
                SenderId = stakeholder,
                RecipientIds = recipientString,
                NotificationTypeId = NotificationType.Maintenance            
            }
        };

        return maintenance;
    }

    public static Appointment ToScheduleAppointment(
           this AppointmentSchedule appointmentSchedule, int stakeholder, string name, StakeholderPerson person)
    {
        
        var recipientIds = new List<int> { appointmentSchedule.Lecturer, stakeholder };
        string recipientString = string.Join(",", recipientIds);

        var appointment = new Appointment
        {
            LecturerId = appointmentSchedule.Lecturer,
            StakeholderId = stakeholder,
            Purpose = appointmentSchedule.Purpose,
            BookingDate = appointmentSchedule.AppointmentDate,
            StartTime = appointmentSchedule.StartTime,
            StatusId = Status.Pending,
            Notification = new Notification
            {
                Message = $"Dear {person.FirstName} {person.LastName}, " + 
                    $" "+
                    $" I hope this message finds you well. " +
                    $" "+
                    $" My name is {name} and I would like to kindly request an appointment with you on " +
                    $" "+
                    $" {appointmentSchedule.AppointmentDate:dddd, MMMM d, yyyy} "+
                    $" "+
                    $" The purpose of the appointment is to discuss {appointmentSchedule.Purpose} "+
                    $" "+
                    $" Please let me know if you are available at that time or suggest an alternative."
                ,
                SenderId = stakeholder,
                RecipientIds = recipientString,
                NotificationTypeId = NotificationType.Appointment
            }
        };

        return appointment;
    }

    public static Appointment ToBookARoom(this BookRoomVM bookRoomVM, int stakeholder, Rooms room)
    {   
        var recipientIds = new List<int> { stakeholder,  };
        string recipientString = string.Join(",", recipientIds);
        
        var bookRoom = new Appointment
        {
            RoomId = bookRoomVM.Room,
            StakeholderId = stakeholder,
            Purpose = bookRoomVM.Purpose,
            BookingDate = bookRoomVM.BookingDate,
            StartTime = bookRoomVM.StartTime,
            EndTime = bookRoomVM.EndTime,
            StatusId = Status.Pending,
            Notification = new Notification
            {
                Message = $"Dear Staff" +
                          $" "+
                          $"I hope this message finds you well." +
                          $" "+
                          $"I am writing to request a booking for Room {room.RoomName} on " +
                          $"{bookRoomVM.BookingDate:dddd, MMMM d, yyyy} " +
                          $"from {bookRoomVM.StartTime:hh\\:mm} to {bookRoomVM.EndTime:hh\\:mm}." +
                          $" "+
                          $"The purpose of this booking is: {bookRoomVM.Purpose}." +
                          $" "+
                          $"Please review and take the necessary action at your earliest convenience."
                ,
                
                SenderId = stakeholder,
                RecipientIds = recipientString,
                NotificationTypeId = NotificationType.Booking
            }
        };

        return bookRoom;
    }
}