using System.ComponentModel;

namespace SmartCampusServicesPortal.Data.Enums;

public enum RoomType
{
    [Description("Study Room")]
    StudyRoom = 1,
    
    [Description("Lecture Hall")]
    LectureHall = 2,
    
    [Description("Lab 1")]
    Lab1 = 3,
    
    [Description("Lab 2")]
    Lab2 = 4,
    
    [Description("Technical Lab")]
    TechnicalLab= 5
}