using Microsoft.AspNetCore.Identity;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Data.Repositories;

namespace SmartCampusServicesPortal.Domain.Manager;

public class StakeholderManager
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly StakeholderRepository _stakeholderRepository;
    private readonly SecurityRepository _securityRepository;
    
    public StakeholderManager(UserManager<ApplicationUser> userManager, StakeholderRepository stakeholderRepository,
        SecurityRepository securityRepository)
    {
        _userManager = userManager;
        _stakeholderRepository = stakeholderRepository;
        _securityRepository = securityRepository;
    }

    public async Task<(bool success, int? stakeholderId)> CreateUserOrganisation(Stakeholder stakeholder, 
        StakeholderPerson person, List<StakeholderContact> contacts, StakeholderRelationship relatedStakeholder,
        List<int> subjects,  ApplicationUser applicationUser )
    {
        var dbStakeholder = await _stakeholderRepository.CreateUserAndStakeholder(
            stakeholder, person, contacts, relatedStakeholder, subjects);

        var user = await _userManager.FindByIdAsync(dbStakeholder.StakeholderId.ToString());
        if (user == null)
        {
            applicationUser.StakeholderId = dbStakeholder.StakeholderId.Value;
            var result = await _userManager.CreateAsync(applicationUser);

            if (!result.Succeeded)
            {
                return (result.Succeeded, null);
            }

            await _securityRepository.SetGroupMemberAsync(
                dbStakeholder.StakeholderId.Value, 
                2,
                dbStakeholder.StakeholderId.Value);

            return (result.Succeeded, dbStakeholder.StakeholderId);
        }

        return (false, null);
    }
    
    public async Task<Stakeholder> GetStakeholderByIdAsync(int stakeholderId)
    {
        return await _stakeholderRepository.GetStakeholdersByStakeholderId(stakeholderId);
    }
    
    public async Task<IEnumerable<UserTitle>> GetUserTitlesAsync()
    {
        return await _stakeholderRepository.GetUserTitlesAsync();
    }
    
    public async Task<StakeholderPerson> GetStakeholderPersonAsync(int stakeholderId)
    {
        return await _stakeholderRepository.GetStakeholderPersonAsync(stakeholderId);
    }
    
    public async Task<IEnumerable<StakeholderContact>> GetStakeholderContactsAsync(
        int? stakeholderId = null, string email = null, ContactType? contactType = null)
    {
        return await _stakeholderRepository.GetStakeholderContactsAsync(stakeholderId, email, contactType);
    }
    
    public async Task<List<GroupMember>> GetGroupUserAsync(int stakeholderId)
    {
        return await _securityRepository.GetGroupUserAsync(stakeholderId);
    }
    
    public async Task<List<GroupAction>> GetUserActionsByGroupIdAsync(IEnumerable<GroupMember> groupMember)
    {
        var result = new List<GroupAction>();

        foreach (var group in groupMember)
        {
            var response = await _securityRepository.GetGroupActionsById(group.GroupId);
            result.AddRange(response);
        }

        return result;
    }

    public async Task<StakeholderPerson> GetUserProfile(int stakeholderId)
    {
        return await _stakeholderRepository.GetStakeholderPersonAsync(stakeholderId);
    }
}