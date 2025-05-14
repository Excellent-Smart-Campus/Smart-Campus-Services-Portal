using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Data.Repositories;

namespace SmartCampusServicesPortal.Domain.Manager;

public class ServiceManager
{
    private readonly ServiceRepository _serviceRepository;
    
    public ServiceManager( ServiceRepository serviceRepository, SecurityRepository securityRepository)
    {
        _serviceRepository = serviceRepository;
    }
    
    public async Task<IEnumerable<AvailableRooms>> GetAvailableRoomsAsync(int year, int month, RoomType?[] status = null)
    {
        var roomTypeList = status != null ? string.Join(",", status.Select(s => (int)s)) : null;
        return await _serviceRepository.GetAvailableRoomsAsync(year, month, roomTypeList);
    }

    public async Task<IEnumerable<Rooms>> GetAllRoomsAsync()
    {
        return await _serviceRepository.GetAllRoomsAsync();
    }
    public async Task<Maintenance> CreateMaintenceBookingAsync(Maintenance maintenance)
    {
        return await _serviceRepository.CreateMaintenceBookingAndNotificationAsync(maintenance);
    }
    
    public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
    {
        return await _serviceRepository.CreateAppointmentAndNotificationAsync(appointment);
    }
    
    public async Task<IEnumerable<Maintenance>> GetMaintenancesAsync(int? stakeholderId, Status?[] statuses = null)
    {
        var statusList = statuses != null ? string.Join(",", statuses.Select(s => (int)s)) : null;

        return await _serviceRepository.GetMaintenancesAsync(stakeholderId, statusList);
    }

    public async Task<Maintenance> GetMaintenancesByIdAsync(int issueId)
    {
        return await _serviceRepository.GetMaintenanceIssueByIdAsyn(issueId);
    }
    
    public async Task<IEnumerable<MarkNotification>> GetStakeholderNotificationsAsync(int stakeholderId)
    {
        return await _serviceRepository.GetStakeholderNotificationsAsync(stakeholderId);
    }
}