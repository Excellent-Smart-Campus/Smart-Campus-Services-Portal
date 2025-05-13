using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

/// <summary>
/// User data model.
/// </summary>
public class SecurityUser
{
    /// <summary>
    /// Gets or sets the stakeholder id.
    /// </summary>
    public int StakeholderId { get; set; }
    
    /// <summary>
    /// Gets or sets the stakeholder type id.
    /// </summary>
    public StakeholderType StakeholderTypeId { get; set; } 

    /// <summary>
    /// Gets or sets the user name.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    /// Gets or sets the name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the password hash.
    /// </summary>
    public string PasswordHash { get; set; }

    /// <summary>
    /// Gets or sets the security stamp.
    /// </summary>
    public string SecurityStamp { get; set; }

    /// <summary>
    ///  Gets or sets the IsDeleted
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    ///  Gets or sets the IsVerified 
    /// </summary>
    public bool IsLocked { get; set; }

    /// <summary>
    ///  Gets or sets the GroupActions 
    /// </summary>
    public List<GroupAction> GroupActions { get; set; }

    /// <summary>
    ///  Gets or sets the GroupMembers 
    /// </summary>
    public List<GroupMember> GroupMembers { get; set; }

}