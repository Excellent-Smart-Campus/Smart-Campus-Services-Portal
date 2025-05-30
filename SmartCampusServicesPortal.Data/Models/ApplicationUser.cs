using System.Security.Principal;
using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class ApplicationUser: IIdentity
{
    /// <summary>
    /// Gets or sets the stakeholder id.
    /// </summary>
    public int StakeholderId { get; set; }
    
    /// <summary>
    /// Gets or sets the stakeholder type id
    /// </summary>
    public virtual StakeholderType StakeholderTypeId { get; set; }
    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    public virtual string UserName { get; set; }

    /// <summary>
    /// Gets or sets the password hash.
    /// </summary>
    public virtual string PasswordHash { get; set; }

    /// <summary>
    /// Gets or sets the normalized user name.
    /// </summary>
    public string NormalizedUserName { get; set; }

    /// <summary>
    /// Gets or sets the authentication type.
    /// </summary>
    public string AuthenticationType { get; set; }

    /// <summary>
    /// Gets or sets the is authenticated.
    /// </summary>
    public bool IsAuthenticated { get; set; }

    /// <summary>
    /// Gets or sets the name.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the security stamp.
    /// </summary>
    public string SecurityStamp { get; set; }

    /// <summary>
    /// If a user is deleted or not 
    /// </summary>
    public virtual bool IsDeleted { get; set; }

    /// <summary>
    ///  If a user is IsVerified or not
    /// </summary>
    public virtual bool IsLocked { get; set; }
    
    /// <summary>
    ///  Gets or sets the groupActions.
    /// </summary>
    public List<GroupAction> GroupActions { get; set; }

    /// <summary>
    ///  Gets or sets the groupMembers.
    /// </summary>
    public List<GroupMember> GroupMembers { get; set; }
}