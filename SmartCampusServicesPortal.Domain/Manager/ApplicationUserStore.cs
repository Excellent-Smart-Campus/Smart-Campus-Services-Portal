using Microsoft.AspNetCore.Identity;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Data.Repositories;
using System.Security.Claims;
using SmartCampusServicesPortal.Domain.Constants;

namespace SmartCampusServicesPortal.Domain.Manager;

public class ApplicationUserStore
    : IUserClaimStore<ApplicationUser>,
          IUserRoleStore<ApplicationUser>,
          IUserPasswordStore<ApplicationUser>,
          IUserSecurityStampStore<ApplicationUser>,
          IUserEmailStore<ApplicationUser>
{
    private readonly SecurityRepository _securityRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="ApplicationUserStore" /> class.
    /// </summary>
    /// <param name="securityRepository">The security repository</param>
    public ApplicationUserStore(SecurityRepository securityRepository)
    {
        _securityRepository = securityRepository;
    }

    /// <inheritdoc />
    public Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.StakeholderId.ToString());
    }

    /// <inheritdoc />
    public Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.UserName);
    }

    /// <inheritdoc />
    public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.NormalizedUserName);
    }

    /// <inheritdoc />
    public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        await _securityRepository.SetSecurityUserAsync(new SecurityUser
        {
            StakeholderId = user.StakeholderId,
            Username = user.UserName,
            SecurityStamp = user.SecurityStamp,
        });

        return IdentityResult.Success;
    }

    /// <inheritdoc />
    public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        var securityUser = await _securityRepository.GetSecurityUserAsync(user.StakeholderId, null);
        securityUser.PasswordHash = user.PasswordHash;
        securityUser.SecurityStamp = user.SecurityStamp;
        securityUser.IsDeleted = user.IsDeleted;
        securityUser.IsLocked = user.IsLocked;
        
        await _securityRepository.SetSecurityUserAsync(securityUser);

        return IdentityResult.Success;
    }

    /// <inheritdoc />
    public async  Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        var securityUser = await _securityRepository.GetSecurityUserAsync(user.StakeholderId, null);
        securityUser.IsDeleted = user.IsDeleted;

        await _securityRepository.SetSecurityUserAsync(securityUser);

        return IdentityResult.Success;
    }

    /// <inheritdoc />
    public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (userId == null) throw new ArgumentNullException(nameof(userId));

        var securityUser = await _securityRepository.GetSecurityUserAsync(Convert.ToInt64(userId), null);
        if (securityUser == null)
            return null;

        return new ApplicationUser
        {
            StakeholderId = securityUser.StakeholderId,
            StakeholderTypeId = securityUser.StakeholderTypeId,
            Name = securityUser.Name,
            UserName = securityUser.Username,
            NormalizedUserName = securityUser.Username,
            PasswordHash = securityUser.PasswordHash,
            SecurityStamp = securityUser.SecurityStamp,
            IsDeleted = securityUser.IsDeleted,
            IsLocked = securityUser.IsLocked,
            GroupMembers = securityUser.GroupMembers,
            GroupActions = securityUser.GroupActions,
        };
    }

    /// <inheritdoc />
    public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (normalizedUserName == null) throw new ArgumentNullException(nameof(normalizedUserName));

        var securityUser = await _securityRepository.GetSecurityUserAsync(null, normalizedUserName);
        if (securityUser == null)
            return null;

        return new ApplicationUser
        {
            StakeholderId = securityUser.StakeholderId,
            StakeholderTypeId = securityUser.StakeholderTypeId,
            Name = securityUser.Name,
            UserName = securityUser.Username,
            NormalizedUserName = securityUser.Username,
            PasswordHash = securityUser.PasswordHash,
            SecurityStamp = securityUser.SecurityStamp,
            IsDeleted = securityUser.IsDeleted,
            IsLocked = securityUser.IsLocked,
            GroupMembers = securityUser.GroupMembers,
            GroupActions = securityUser.GroupActions,
        };
    }

    /// <inheritdoc />
    public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (user == null) throw new ArgumentNullException(nameof(user));

        user.PasswordHash = passwordHash;

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.PasswordHash);
    }

    /// <inheritdoc />
    public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
    }

    /// <inheritdoc />
    public Task SetSecurityStampAsync(ApplicationUser user, string stamp, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (user == null) throw new ArgumentNullException(nameof(user));
        if (stamp == null) throw new ArgumentNullException(nameof(stamp));

        user.SecurityStamp = stamp;

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task<string> GetSecurityStampAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.SecurityStamp);
    }

    /// <inheritdoc />
    public async Task<IList<Claim>> GetClaimsAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        var dbUser = await _securityRepository.GetSecurityUserAsync(user.StakeholderId, null);
        

        var claims = new List<Claim>
            {
                new (CustomClaims.StakeholderId, dbUser.StakeholderId.ToString()),
                new (CustomClaims.Name, dbUser.Name.Trim()),
                new (CustomClaims.IsDeleted, dbUser.IsDeleted.ToString()),
                new (CustomClaims.IsLocked, dbUser.IsLocked.ToString()),
                new (CustomClaims.StakeholderTypeId, dbUser.StakeholderTypeId.ToString())
            };

        if (dbUser.GroupActions != null && dbUser.GroupActions.Count > 0)
        {
            foreach (var action in dbUser.GroupActions)
            {
                claims.Add(new Claim(CustomClaims.GroupAction, action.ActionId.ToString()));
            }
        }

        return claims;
    }

    /// <inheritdoc />
    public Task AddClaimsAsync(ApplicationUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task ReplaceClaimAsync(ApplicationUser user, Claim claim, Claim newClaim, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task RemoveClaimsAsync(ApplicationUser user, IEnumerable<Claim> claims, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<IList<ApplicationUser>> GetUsersForClaimAsync(Claim claim, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    Task IUserRoleStore<ApplicationUser>.AddToRoleAsync(ApplicationUser user, string roleName,
        CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task RemoveFromRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<IList<string>> GetRolesAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<bool> IsInRoleAsync(ApplicationUser user, string roleName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<IList<ApplicationUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public void Dispose()
    {
    }

    /// <inheritdoc />
    public Task SetEmailAsync(ApplicationUser user, string email, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task<string> GetEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.UserName);
    }

    /// <inheritdoc />
    public Task<bool> GetEmailConfirmedAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.FromResult(user.IsLocked);
    }

    /// <inheritdoc />
    public Task SetEmailConfirmedAsync(ApplicationUser user, bool confirmed, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        user.IsLocked = confirmed;

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task<ApplicationUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (string.IsNullOrEmpty(normalizedEmail)) throw new ArgumentNullException(nameof(normalizedEmail));

        var securityUser = await _securityRepository.GetSecurityUserAsync(null, normalizedEmail);
        if (securityUser == null)
            return null;

        return new ApplicationUser
        {
            StakeholderId = securityUser.StakeholderId,
            StakeholderTypeId = securityUser.StakeholderTypeId,
            Name = securityUser.Name,
            UserName = securityUser.Username,
            NormalizedUserName = securityUser.Username,
            PasswordHash = securityUser.PasswordHash,
            SecurityStamp = securityUser.SecurityStamp,
            IsDeleted = securityUser.IsDeleted,
            IsLocked = securityUser.IsLocked,
            GroupMembers = securityUser.GroupMembers,
            GroupActions = securityUser.GroupActions,
        };
    }

    /// <inheritdoc />
    public Task<string> GetNormalizedEmailAsync(ApplicationUser user, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc />
    public Task SetNormalizedEmailAsync(ApplicationUser user, string normalizedEmail, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (user == null) throw new ArgumentNullException(nameof(user));

        return Task.CompletedTask;
    }
}
