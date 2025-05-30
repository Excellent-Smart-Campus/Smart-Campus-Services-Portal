using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain.Manager;
using SmartCampusServicesPortal.Server.ViewModels;

namespace SmartCampusServicesPortal.Server.Controller;

[ApiController]
[Route("/api/[controller]")]
[Authorize]
public class EducationController : BaseController
{
    private readonly EducationManager _educationManager;
    private readonly StakeholderManager _stakeholderManager;

    public EducationController(EducationManager educationManager, StakeholderManager stakeholderManager)
    {
        _educationManager = educationManager;
        _stakeholderManager = stakeholderManager;
    }
    
    [HttpGet("course/list", Name = "getCourseById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [AllowAnonymous]
    public async Task<IEnumerable<Course>>GetCourseById([FromQuery]int? courseId)
    {
        var results =  await _educationManager.GetCourseByIdAsync(courseId);
        return results;
    }
    
    [HttpGet("course/subjects", Name = "getSubjectsCourseById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [AllowAnonymous]
    public async Task<IEnumerable<Subject>> GetSubjectsByCourseId([FromQuery]int? courseId)
    {
        return await _educationManager.GetSubjectsByCourseIdAsync(courseId);
    }
    
    [HttpGet("subject/subjectLecturers", Name = "getSubjectLecturers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<SubjectLecture>> GetSubjectsLecturer([FromQuery]int subjectId)
    {
        return await _educationManager.GetRegisteredSubjectLecturersAsync(subjectId);
    }
    
    [HttpGet("course/subjectsAndCourse", Name = "getSubjectAndCourseById")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<Course> GetSubjectAndCourseByIdAsync([FromQuery] int? subjectId)
    {
        return await _educationManager.GetSubjectAndCourseByIdAsync(subjectId);
    }

    [HttpGet("course/timetable", Name = "getTimetable")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<TimeTable> GetTimetableAsync()
    {
        var res = await _educationManager.GetTimeTableAsync(GetStakeholderId());
        return res;
    }
    
    [HttpGet("course/enrolledSubject", Name = "getEnrolledSubject")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Course>> GetEnrolledSubjectAsync([FromQuery] int? stakeholder)
    {
        return await _educationManager.GetEnrolledSubjectsAsync(stakeholder ?? GetStakeholderId());
    }
    
    [HttpGet("course/registeredStakeholder", Name = "getRegisteredStakholder")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<RegisteredStakeholder>> GetRegisteredStakeholderAsync([FromQuery] StakeholderType stakeholderType)
    {
        return await _educationManager.GetRegisteredStakeholderAsync(stakeholderType);
    }
}