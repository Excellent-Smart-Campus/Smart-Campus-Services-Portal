using System.ComponentModel;

namespace SmartCampusServicesPortal.Data.Enums;

public enum ContactType
{
    [Description("Email")]
    Email = 1,

    [Description("Mobile")]
    CellPhone = 2,
}
