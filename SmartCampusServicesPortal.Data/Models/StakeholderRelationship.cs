using System.Text.Json.Serialization;
using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class StakeholderRelationship
{
    /// <summary>
    /// Gets or sets the stakeholder id.
    /// </summary>
   [JsonIgnore]
    public int StakeholderId { get; set; }

    /// <summary>
    /// Gets or sets the related relationship id.
    /// </summary>
    public int RelatedStakeholderId { get; set; }
    
    /// <summary>
    /// Gets or sets the stakeholder relationship type id.
    /// </summary>
    public StakeholderRelationshipType StakeholderRelationshipTypeId { get; set; }

    /// <summary>
    /// Gets or sets the relationship's effective date.
    /// </summary>
    public DateTime EffectiveDate { get; set; }

    /// <summary>
    /// Gets or sets the relationship's end date.
    /// </summary>
    public DateTime? EndDate { get; set; }
}