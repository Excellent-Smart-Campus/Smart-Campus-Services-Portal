using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Data.Repositories;

namespace SmartCampusServicesPortal.Domain.Manager;

public class EducationManager
{
    private readonly StakeholderRepository _stakeholderRepository;
    private readonly EducationRepository _educationRepository;
    
    public EducationManager(StakeholderRepository stakeholderRepository, EducationRepository educationRepository)
    {
        _stakeholderRepository = stakeholderRepository;
        _educationRepository = educationRepository;
    }
    
    public async Task<IEnumerable<Course>> GetCourseByIdAsync(int? courseId)
    {
        return await _educationRepository.GetCourseByIdAsync(courseId);
    }
    
    public async Task<Course> GetSubjectAndCourseByIdAsync(int? subjectId)
    {
        return await _educationRepository.GetSubjectAndCourseByIdAsync(subjectId);
    }
    
    public async Task<IEnumerable<Subject>> GetSubjectsByCourseIdAsync(int? courseId)
    {
        return await _educationRepository.GetSubjectsByCourseIdAsync(courseId);
    }

    public async Task<TimeTable> GetTimeTableAsync(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType = null){
        return await _educationRepository.GetTimeTableAsync(stakeholderId, stakeholderRelationshipType);
    }

    public async Task<Course> GetEnrolledSubjectsAsync(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType = null){
        return await _educationRepository.GetStakeholderCourseAndSubjectsAsyn(stakeholderId, stakeholderRelationshipType);
    }
}