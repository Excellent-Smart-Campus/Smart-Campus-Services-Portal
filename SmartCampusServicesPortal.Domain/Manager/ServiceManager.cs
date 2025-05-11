using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Data.Repositories;

namespace SmartCampusServicesPortal.Domain.Manager;

public class ServiceManager
{
    private readonly StakeholderRepository _stakeholderRepository;
    private readonly ServiceRepository _serviceRepository;
    private readonly SecurityRepository _securityRepository;
    
    public ServiceManager(StakeholderRepository stakeholderRepository, ServiceRepository serviceRepository, SecurityRepository securityRepository)
    {
        _stakeholderRepository = stakeholderRepository;
        _serviceRepository = serviceRepository;
        _securityRepository = securityRepository;
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
}