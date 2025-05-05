using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Server.ViewModels;

namespace SmartCampusServicesPortal.Server.Extentions;

public static class ModelExtention
{
    public static Stakeholder ToStakeHolderUser(this RegisterVM registerVM)
    {
        var stakeholder = new Stakeholder
        {
            Name = $"{registerVM.FirstName} {registerVM.LastName}",
            StakeholderTypeId = StakeholderType.Student,
        };

        return stakeholder;
    }
    public static StakeholderPerson ToPerson(this RegisterVM registerVM)
    {
        var person = new StakeholderPerson
        {
            FirstName = registerVM.FirstName,
            LastName = registerVM.LastName,
            TitleId = registerVM.Title,
        };

        return person;
    }
    public static List<StakeholderContact> ToContacts(this RegisterVM registerVM)
    {
        var contacts = new List<StakeholderContact>();

        if (!string.IsNullOrEmpty(registerVM.MobileNumber))
        {
            contacts.Add(new StakeholderContact
            {
                Detail = registerVM.MobileNumber,
                ContactTypeId = ContactType.CellPhone,
            });
        }

        if (!string.IsNullOrEmpty(registerVM.Email))
        {
            contacts.Add(new StakeholderContact
            {
                Detail = registerVM.Email.ToLower(),
                ContactTypeId = ContactType.Email
            });
        }

        return contacts;
    }
    public static StakeholderRelationship ToRelatedStakeholder(this RegisterVM registerVM)
    {
        var stakeholderRelated = new StakeholderRelationship()
        {
            RelatedStakeholderId = registerVM.Course,
            StakeholderRelationshipTypeId = StakeholderRelationshipType.Enrolled
        };
        
        return stakeholderRelated;
    }
    public static ApplicationUser ToUSer(this RegisterVM registerVM)
    {
        return new ApplicationUser
        {
            UserName = registerVM.Email.ToLower(),
        };
    }
}