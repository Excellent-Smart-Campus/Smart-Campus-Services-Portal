using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using SmartCampusServicesPortal.Data.Enums;
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

    public async Task<Maintenance> CreateMaintenceBookingAndNotificationAsync(Maintenance maintenance)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var dbMaintenance = await CreateMaintenceBookingAsync(maintenance, connection, transaction);
        
        transaction.Commit();
        return dbMaintenance;
    }
    
    public async Task<Appointment> CreateAppointmentAndNotificationAsync(Appointment appointment)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var dbAppointment = await CreateAppointmentAsync(appointment, connection, transaction);
        
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
        
        return await connection.QueryFirstOrDefaultAsync<Appointment>(
            "svc.SetBooking",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
}