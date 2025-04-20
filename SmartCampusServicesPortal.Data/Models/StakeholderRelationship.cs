using SmartCampusServicesPortal.Data.Enums;

namespace SmartCampusServicesPortal.Data.Models;

public class StakeholderRelationship
{
    /// <summary>
    /// Gets or sets the stakeholder id.
    /// </summary>
    public int StakeholderId { get; set; }

    /// <summary>
    /// Gets or sets the stakeholder name.
    /// </summary>
    public string StakeholderName { get; set; }

    /// <summary>
    /// Gets or sets the stakeholder type id.
    /// </summary>
    public StakeholderType StakeholderTypeId { get; set; }

    /// <summary>
    /// Gets or sets the related stakeholder id.
    /// </summary>
    public int RelatedStakeholderId { get; set; }

    /// <summary>
    /// Gets or sets the related stakeholder name.
    /// </summary>
    public string RelatedStakeholderName { get; set; }

    /// <summary>
    /// Gets or sets the related stakeholder type.
    /// </summary>
    public StakeholderType RelatedStakeholderTypeId { get; set; }

    /// <summary>
    /// Gets or sets the relationship type id.
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