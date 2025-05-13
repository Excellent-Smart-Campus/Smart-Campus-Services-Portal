using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain.Manager;
using SmartCampusServicesPortal.Server.Utils;
using SmartCampusServicesPortal.Server.ViewModels;
using Action = SmartCampusServicesPortal.Data.Models.Action;

namespace SmartCampusServicesPortal.Server.Controller;

[ApiController]
[Route("/api/[controller]")]
public class AdminController : BaseController
{
    private readonly StakeholderManager _stakeholderManager;
    private readonly ServiceManager _serviceManager;
    private readonly UserManager<ApplicationUser> _userManager;
    
    public AdminController(StakeholderManager stakeholderManager, ServiceManager serviceManager, UserManager<ApplicationUser> userManager) {
        _stakeholderManager = stakeholderManager; 
        _serviceManager = serviceManager;
        _userManager = userManager;
    }
    
    [HttpGet("getSystemPermission")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Action>> GetSystemPermission()
    {
        return await _stakeholderManager.GetAllActionsAsync();
    }
    
    [HttpGet("getAllUsers")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _stakeholderManager.GetAllUsersAsync();
    }
    
    [HttpGet("getGroup")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<Group>> GetRooms([FromQuery] int? groupId)
    {
        return await _stakeholderManager.GetAllGroupAsync(groupId);
    }
    
    [HttpGet("getUser")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<StakeholderPerson>> GetUser([FromQuery] int stakeholder)
    {
        return await _stakeholderManager.GetUserDetailsAsync(stakeholder);
    }

    [HttpGet("getGroupActions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<List<GroupAction>> GetGroupActionsAsync([FromQuery] int groupId)
    {
        return await _stakeholderManager.GetGroupActionsAsync(groupId);
    }
    
    [HttpPost("lockUser")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> LockUser(LockUser lockUser)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var user = await _userManager.FindByIdAsync(lockUser.Stakeholder.ToString());

        if (user == null || user.IsDeleted)
        {
            return NotFound(new { message = ErrorMessagesConstant.NoUserFound, success = false });
        }
        
        user.IsLocked = lockUser.IsLocked;
        await _userManager.UpdateAsync(user);
        
        var updatedUser = await _userManager.FindByIdAsync(lockUser.Stakeholder.ToString());

        if (updatedUser == null || user.IsDeleted)
        {
            return NotFound(new { message = ErrorMessagesConstant.NoUserFound, success = false });
        }

        if (updatedUser.IsLocked == lockUser.IsLocked)
        {
            return Ok(new { success = true, message = ErrorMessagesConstant.AccountStatusSuccess });
        }
        return BadRequest(new { message = ErrorMessagesConstant.AccountStatusFailure, success = false });
    }


}