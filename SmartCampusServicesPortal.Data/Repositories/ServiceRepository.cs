using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using SmartCampusServicesPortal.Data.Models;

namespace SmartCampusServicesPortal.Data.Repositories;

public class ServiceRepository(string connectionString) : BaseRepository(connectionString)
{

    public async Task<IEnumerable<AvailableRooms>> GetAvailableRoomsAsync(int year, int month, string roomTypeid = null)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@year", year);
        queryParameters.Add("@month", month);
        queryParameters.Add("@roomTypeid", roomTypeid);
        
        return await connection.QueryAsync<AvailableRooms>(
            "svc.GetAvailableRoom",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }
    
    public async Task<IEnumerable<Rooms>> GetAllRoomsAsync()
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        return await connection.QueryAsync<Rooms>(
            "svc.GetAllRooms",
            commandType: CommandType.StoredProcedure);
    }
    
    public async Task<IEnumerable<Maintenance>> GetMaintenancesAsync(int? stakeholderId,  string status = null){
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();
        
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@statudId", status);

        return await connection.QueryAsync<Maintenance>(
            "svc.GetStakeholderMaintenanceRequest",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);
    }

    public async Task<Maintenance> GetMaintenanceIssueByIdAsyn(int issueId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@issueId", issueId);
        
        return await connection.QueryFirstOrDefaultAsync<Maintenance>(
            "svc.GetMaintenanceIssue",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }

    public async Task<Appointment> GetBookingAsync(int issueId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@bookingId", issueId);
        
        return await connection.QueryFirstOrDefaultAsync<Appointment>(
            "svc.GetBooking",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }
    

    public async Task<Maintenance> CreateMaintenceBookingAndNotificationAsync(Maintenance maintenance)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var dbMaintenance = await CreateMaintenceBookingAsync(maintenance, connection, transaction);

        maintenance.Notification.ReferenceId = dbMaintenance.IssueId;
        await CreateNotificationWithRecipientsAsync(maintenance.Notification, connection, transaction);

        transaction.Commit();
        return dbMaintenance;
    }
    
    public async Task<Appointment> CreateAppointmentAndNotificationAsync(Appointment appointment)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var dbAppointment = await CreateAppointmentAsync(appointment, connection, transaction);
        
        appointment.Notification.ReferenceId = dbAppointment.BookingId;
        await CreateNotificationWithRecipientsAsync(appointment.Notification, connection, transaction);

        transaction.Commit();
        return dbAppointment;
    }
    
    public async Task<Maintenance> CreateMaintenceBookingAsync(Maintenance maintenance)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await CreateMaintenceBookingAsync(maintenance, connection);
    }
    
    public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await CreateAppointmentAsync(appointment, connection);
    }
    
    public async Task<IEnumerable<Appointment>> GetBookingForStakeholderAsync(int stakeholder)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();

        queryParameters.Add("@stakeholderId", stakeholder);

        return await connection.QueryAsync<Appointment>(
            "svc.GetBookingForStakeholder",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
    }


    public async Task<IEnumerable<MarkNotification>> GetStakeholderNotificationsAsync(int stakeholder)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholder);

        Dictionary<int, MarkNotification> markNotificationDictionary = new Dictionary<int, MarkNotification>();

        await connection.QueryAsync<MarkNotification, Subject, MarkNotification>(
            "ntf.GetNotificationsForStakeholder",
            (notification, subjects) =>
            {
                if (!markNotificationDictionary.TryGetValue(notification.NotificationId.Value, out MarkNotification markNotificationInstance))
                {
                    markNotificationInstance = notification;
                    markNotificationInstance.Subject = new Subject();
                    markNotificationDictionary.Add(notification.NotificationId.Value, markNotificationInstance);
                }
                if (subjects != null)
                {
                    markNotificationInstance.Subject = new Subject
                    {
                        SubjectId = subjects.SubjectId,
                        SubjectCode = subjects.SubjectCode,
                        SubjectName = subjects.SubjectName,
                    };
                }
                return notification;
            },
            splitOn: "SubjectId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );

        return markNotificationDictionary.Values;
    }

    public async Task<bool> MarkNotificationsAsync(int stakeholder)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholder);
        
        return await connection.QueryFirstOrDefaultAsync<bool>(
            "ntf.MarkNotificationAsRead",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);
    }

    public async Task<IEnumerable<Appointment>> GetRoomBookingForAdminAsync()
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        Dictionary<int, Appointment> appointmentDictionary = new Dictionary<int, Appointment>();

        await connection.QueryAsync<Appointment, Rooms, Appointment>(
            "svc.GetBookingsForAdmin",
            (appointment, room) =>
            { 
                if (!appointmentDictionary.TryGetValue(appointment.BookingId.Value, out Appointment appointmentInstance))
                { 
                    appointmentInstance = appointment; 
                    appointmentInstance.Room = new Rooms(); 
                    appointmentDictionary.Add(appointment.BookingId.Value, appointmentInstance);
                } 
                if (room != null) 
                { 
                    appointmentInstance.Room = new Rooms 
                    { 
                        RoomId = room.RoomId, 
                        RoomTypeId = room.RoomTypeId, 
                        RoomNumber = room.RoomNumber, 
                        RoomName = room.RoomName
                    };
                } 
                return appointment;
            }, 
            splitOn: "RoomId", 
            commandType: CommandType.StoredProcedure,
            commandTimeout: DefaultTimeout
        );
        
        return appointmentDictionary.Values;
    }

    private async Task<Maintenance> CreateMaintenceBookingAsync(Maintenance maintenance,
        SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@issueId", maintenance.IssueId);
        queryParameters.Add("@stakeholderId", maintenance.StakeholderId);
        queryParameters.Add("@roomId", maintenance.RoomId);
        queryParameters.Add("@title", maintenance.Title);
        queryParameters.Add("@description", maintenance.Description);
        queryParameters.Add("@statusId", maintenance.StatusId);

        return await connection.QueryFirstOrDefaultAsync<Maintenance>(
            "svc.SetMaintenanceIssue",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
    
    private async Task<Appointment> CreateAppointmentAsync(Appointment appointment, 
        SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@bookingId", appointment.BookingId);
        queryParameters.Add("@stakeholderId", appointment.StakeholderId);
        queryParameters.Add("@lecturerId", appointment.LecturerId);
        queryParameters.Add("@roomId", appointment.RoomId);
        queryParameters.Add("@purpose", appointment.Purpose);
        queryParameters.Add("@bookingDate", appointment.BookingDate);
        queryParameters.Add("@startTime", appointment.StartTime);
        queryParameters.Add("@endTime", appointment.EndTime);
        queryParameters.Add("@statusId", appointment.StatusId);
        
        var results =  await connection.QueryFirstOrDefaultAsync<Appointment>(
            "svc.SetBooking",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);

        return results;
    }

    private async Task<Notification> CreateNotificationWithRecipientsAsync(Notification notification,
        SqlConnection connection, SqlTransaction transaction = null){
             var queryParameters = new DynamicParameters();
        queryParameters.Add("@senderId", notification.SenderId);
        queryParameters.Add("@notificationTypeId", (int)notification.NotificationTypeId);
        queryParameters.Add("@message", notification.Message);
        queryParameters.Add("@subjectId", notification.SubjectId);
        queryParameters.Add("@referenceId", notification.ReferenceId);
        queryParameters.Add("@recipientIds", notification.RecipientIds);
        
        return await connection.QueryFirstOrDefaultAsync<Notification>(
            "ntf.CreateNotificationWithRecipients",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }

    private async Task<Notification> DistributeSubjectNotificationsAsync(int senderId, int subjectId,
         string message, SqlConnection connection, SqlTransaction transaction = null
        ){
             var queryParameters = new DynamicParameters();
            queryParameters.Add("@senderId", senderId);
            queryParameters.Add("@message", message);
            queryParameters.Add("@subjectId", subjectId);
            
            return await connection.QueryFirstOrDefaultAsync<Notification>(
                "ntf.DistributeSubjectNotification",
                commandType: CommandType.StoredProcedure,
                param: queryParameters,
                transaction: transaction,
                commandTimeout: DefaultTimeout
            );
    }
}