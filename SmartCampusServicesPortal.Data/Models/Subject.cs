namespace SmartCampusServicesPortal.Data.Models;

public class Subject
{
    public int SubjectId { get; set; }
    public string SubjectCode { get; set; }
    public string SubjectName { get; set; }
    public bool IsMandatory { get; set; }
}