using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class Course
{
    public int CourseId { get; set; }
    public string CourseCode { get; set; }
    public string CourseName { get; set; }
    public StakeholderType? StakeholderTypeId { get; set; }
    public string StakholderType { get; set; }
    public List<Subject> Subjects { get; set; } = new List<Subject>();
}