using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain.Manager;
using SmartCampusServicesPortal.Server.Extentions;
using SmartCampusServicesPortal.Server.Helper;
using SmartCampusServicesPortal.Server.Utils;
using SmartCampusServicesPortal.Server.ViewModels;

namespace SmartCampusServicesPortal.Server.Controller;

[ApiController]
[Route("/api/[controller]")]
public class AuthController : BaseController
{
    private readonly ILogger<AuthController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly StakeholderManager _stakeholderManager;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
       ILogger<AuthController> logger, StakeholderManager stakeholderManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _stakeholderManager = stakeholderManager;
    }
    
    /// <summary>
    /// Login: Users log in using their email and password. If successful, a Cookie token is returned.
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Login([FromBody] LoginVM model)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (User.Identity.IsAuthenticated)
            {
                return BadRequest(new { message = ErrorMessagesConstant.UserAlreadyLoggedIn, success = false });
            }

            var user = await _userManager.FindByEmailAsync(model.Username);

            if (user == null || user.IsDeleted)
            {
                return NotFound(new { message = ErrorMessagesConstant.NoUserFound, success = false });
            }

            if (!UserHasAction(user, UserAction.Login))
            {
                return Unauthorized(new { message = ErrorMessagesConstant.NoPermissionToLogIn, success = false });
            }

            if (!user.IsLocked == false)
            {
                return BadRequest(new { message = ErrorMessagesConstant.AccountLocked, success = false });
            }
            
            var result = await _signInManager.PasswordSignInAsync(user, model.Password, true, lockoutOnFailure: true);

            if (!result.Succeeded)
            {
                int currentFailCount = _failedLoginAttempts.AddOrUpdate(user.UserName, 1, (_, count) => count + 1);

                if (currentFailCount >= 5)
                {
                    user.IsLocked = true;
                    await _userManager.UpdateAsync(user);
                    _failedLoginAttempts.TryRemove(user.UserName, out _);
                    return Unauthorized(new { message = ErrorMessagesConstant.ManyAttemptsLockAccount, success = false });
                }

                return Unauthorized(new { message = ErrorMessagesConstant.InvalidCredentials, success = false });
            }
        
            _failedLoginAttempts.TryRemove(user.UserName, out _);
            return Ok(new { success = true, message = ErrorMessagesConstant.LoginSuccess });
        }
        catch (Exception ex)
        {
            _logger.LogError("Login - Error when Login in Error: {Error}",
               String.Join(Environment.NewLine, ex));

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = ErrorMessagesConstant.UnexpectedError,
                success = false
            });
        }
    }

    /// <summary>
    /// Register.
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegisterVM model)
    {
        try
        {
            var userExist = await _userManager.FindByEmailAsync(model.Email);
            var emailExist = await _stakeholderManager.GetStakeholderContactsAsync(null, model.Email, ContactType.Email);

            if (userExist != null || emailExist.Any())
            {
                ModelState.AddModelError("Email", ErrorMessagesConstant.EmailAlreadyExists);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var register = await _stakeholderManager.CreateUserOrganisation(
                model.ToStakeHolderUser(),
                model.ToPerson(),
                model.ToContacts(),
                model.ToRelatedStakeholder(),
                model.Subjects,
                model.ToUSer()
            );

            if (!register.success)
            {
                return BadRequest(new { message = ErrorMessagesConstant.RegistrationError, success = false });
            }

            var user = await _userManager.FindByIdAsync(register.stakeholderId.Value.ToString());

            await _userManager.AddPasswordAsync(user, model.Password);

            return Ok(new
            {
                message = ErrorMessagesConstant.RegistrationSuccess, 
                success = true, 
                email = model.Email,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError("RegisterVM - Error when registering a new user and organisation Error: {Error}",
                String.Join(Environment.NewLine, ex));

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = ErrorMessagesConstant.UnexpectedError,
                success = false
            });
        }
    }
    
    /// <summary>
    /// logout user
    /// </summary>
    /// <returns></returns>
    [Authorize]
    [ActionAuthorize(UserAction.Login)]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesDefaultResponseType]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        Response.Cookies.Delete(IdentityConstants.ApplicationScheme);
        Response.Cookies.Delete(IdentityConstants.ExternalScheme);
        return Ok(new { message = "Signed out successfully.", success = true });
    }
    
    [HttpGet("getUserTitles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IEnumerable<UserTitle>> GetUserTitles()
    {
        return await _stakeholderManager.GetUserTitlesAsync();
    }
    
    [Authorize]
    [ActionAuthorize(UserAction.Login)]
    [HttpGet("getGetUserGroup")]
    public async Task<IEnumerable<GroupMember>> GetUserGroup()
    {
        return await _stakeholderManager.GetGroupUserAsync(GetStakeholderId());
    }

    [Authorize]
    [ActionAuthorize(UserAction.Login)]
    [HttpGet("getGroupAction")]
    public async Task<IEnumerable<GroupMember>> GetGroupAction()
    {
        return await _stakeholderManager.GetGroupUserAsync(GetStakeholderId());
    }

    [Authorize]
    [ActionAuthorize(UserAction.Login)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [HttpGet("userAuthenticated")]
    public async Task<IActionResult> UserAuthenticated()
    {
        var result = await GetUserGroup();
        var userActions = await _stakeholderManager.GetUserActionsByGroupIdAsync(result);

        return Ok(new
        {
            IsAuthenticated = User.Identity?.IsAuthenticated,
            User = result.FirstOrDefault(),
            UserActions = userActions
        });
    }
    
    [ActionAuthorize(UserAction.ViewProfile)]
    [HttpGet("userProfile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public async Task<IActionResult> GetUserProfile()
    {
        var user = await _userManager.FindByIdAsync(GetStakeholderId().ToString());
        if (user == null)
        {
            return NotFound(new { message = ErrorMessagesConstant.NoUserFound, success = false });
        }
        
        var contacts = await _stakeholderManager.GetStakeholderContactsAsync(user.StakeholderId);
        
        var stakeholder = await _stakeholderManager.GetUserProfile(user.StakeholderId);

        var contactDetails = contacts?.Select(c => new ContactsVM
        {
            Detail = c.Detail,
            ContactType = c.ContactTypeId,
            ContactId = c.ContactId
        }).ToList() ?? new List<ContactsVM>();
        
        var profileViewModel = new ProfileVM
        {
            FirstName = stakeholder.FirstName,
            LastName = stakeholder.LastName,
            Title = stakeholder?.TitleId,
            Contacts = contactDetails
        };
        
        return Ok(profileViewModel);
    }
    
    [ActionAuthorize(UserAction.UpdateProfile)]
    [HttpPost("updateUserProfile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public async Task<IActionResult> UpdateUserProfile()
    {
        var user = await _userManager.FindByIdAsync(GetStakeholderId().ToString());
        if (user == null)
        {
            return NotFound(new { message = ErrorMessagesConstant.NoUserFound, success = false });
        }
        
        /*To Do */
        
        return Ok();
    }
    
    private bool UserHasAction(ApplicationUser user, UserAction action)
    {
        if (user.GroupActions == null || !user.GroupActions.Any())
        {
            return false;
        }

        return user.GroupActions.Any(c => c.ActionId == action);
    }

    private static readonly ConcurrentDictionary<string, int> _failedLoginAttempts = new();

}