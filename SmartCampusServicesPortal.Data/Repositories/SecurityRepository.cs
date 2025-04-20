namespace SmartCampusServicesPortal.Data;

public class SecurityRepository(string connectionString) : BaseRepository(connectionString)
{
        /// <summary>
    /// Creates a transact that fetches user security, group actions, group memebrs.
    /// </summary>
    /// <param name="stakeholderId"></param>
    /// <param name="userName"></param>
    /// <returns></returns>
    public async Task<SecurityUser> GetSecurityUserAsync(long? stakeholderId, string userName, bool excludeMembersAndActions = false)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var user = await GetSecurityUserAsync(stakeholderId, userName, connection, transaction);

        if(user != null && !excludeMembersAndActions)
        {
            await GetAllGroupMembersAsync(user, connection, transaction);

            foreach (var group in user.GroupMembers)
            {
                var actions = await GetGroupActionsAsync(group.GroupId, connection, transaction);
                user.GroupActions = actions;
            }
        }

        await transaction.CommitAsync();

        return user;
    }

    /// <summary>
    /// Sets the Security user 
    /// </summary>
    /// <param name="securityUser"></param>
    /// <returns></returns>
    public async Task<SecurityUser> SetSecurityUserAsync(SecurityUser securityUser)
    {
        await using var connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", securityUser.StakeholderId);
        queryParameters.Add("@username", securityUser.Username);
        queryParameters.Add("@passwordHash", securityUser.PasswordHash);
        queryParameters.Add("@securityStamp", securityUser.SecurityStamp);
        queryParameters.Add("@isDeleted", securityUser.IsDeleted);
        queryParameters.Add("@isVerified", securityUser.IsVerified);
        queryParameters.Add("@roleId", securityUser.RoleId);
        queryParameters.Add("@titleId", securityUser.TitleId);

        return await connection.QueryFirstOrDefaultAsync<SecurityUser>(
            "usr.SetSecurityUser",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);

    }

    /// <summary>
    /// Get the group actions by group id.
    /// </summary>
    /// <param name="groupId"></param>
    /// <param name="connection"></param>
    /// <param name="transaction"></param>
    /// <returns></returns>
    private async Task<List<GroupAction>> GetGroupActionsAsync(int groupId, SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@groupId", groupId);

       return (await connection.QueryAsync<GroupAction>(
                 "usr.GetGroupAction",
                 commandType: CommandType.StoredProcedure,
                 param: queryParameters,
                 transaction: transaction,
                 commandTimeout: DefaultTimeout)).ToList();
    }

    /// <summary>
    /// Get the  group members by stakeholder id.
    /// </summary>
    /// <param name="securityUser"></param>
    /// <param name="connection"></param>
    /// <param name="transaction"></param>
    /// <returns></returns>
    private static async Task GetAllGroupMembersAsync(SecurityUser securityUser, SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", securityUser.StakeholderId);

        var groupMembers = await connection.QueryAsync<GroupMember>(
            "usr.GetGroupMembershipByStakeHolderId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);

        securityUser.GroupMembers = groupMembers.ToList();
    }

    /// <summary>
    /// Get the user security by stakeholder id or username.
    /// </summary>
    /// <param name="stakeholderId"></param>
    /// <param name="userName"></param>
    /// <param name="connection"></param>
    /// <param name="transaction"></param>
    /// <returns></returns>
    private async Task<SecurityUser> GetSecurityUserAsync(long? stakeholderId, string userName, SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@userName", userName);

        return await connection.QueryFirstOrDefaultAsync<SecurityUser>(
            "usr.GetSecurityUser",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
}