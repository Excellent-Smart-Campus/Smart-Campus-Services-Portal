using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using SmartCampusServicesPortal.Data.Models;

namespace SmartCampusServicesPortal.Data.Repositories;

public class SecurityRepository(string connectionString) : BaseRepository(connectionString)
{
    public async Task<SecurityUser> GetSecurityUserAsync(long? stakeholderId, string userName, bool excludeMembersAndActions = false)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var user = await GetSecurityUserAsync(stakeholderId, userName, connection, transaction);

        if(user != null && !excludeMembersAndActions)
        {
            user.GroupMembers = await GetGroupUserAsync(user.StakeholderId, connection, transaction);

            foreach (var group in user.GroupMembers)
            {
                var actions = await GetGroupActionsAsync(group.GroupId, connection, transaction);
                user.GroupActions = actions;
            }
        }

        await transaction.CommitAsync();

        return user;
    }
        
    public async Task<SecurityUser> SetSecurityUserAsync(SecurityUser securityUser)
    {
        await using var connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", securityUser.StakeholderId);
        queryParameters.Add("@username", securityUser.Username);
        queryParameters.Add("@passwordHash", securityUser.PasswordHash);
        queryParameters.Add("@securityStamp", securityUser.SecurityStamp);
        queryParameters.Add("@isDeleted", securityUser.IsDeleted);
        queryParameters.Add("@isLocked", securityUser.IsLocked);

        return await connection.QueryFirstOrDefaultAsync<SecurityUser>(
            "usr.SetSecurityUser",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);
    }
    
    public async Task<GroupMember> SetGroupMemberAsync(int stakeholderId, int groupId, int userId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();

        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@groupId", groupId);
        queryParameters.Add("@userId", userId);

        return await connection.QueryFirstOrDefaultAsync<GroupMember>(
            "usr.SetGroupMember",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);
    }
    
    public async Task<List<GroupMember>> GetGroupUserAsync(int stakeholderId)
    {
        await using var connection = await GetOpenConnectionAsync();
        return await GetGroupUserAsync(stakeholderId, connection);
    }
    
    public async Task<List<GroupAction>> GetGroupActionsById(int stakeholderId)
    {
        await using var connection = await GetOpenConnectionAsync();
        return await GetGroupActionsAsync(stakeholderId, connection);
    }
    
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
    
    private static async Task<List<GroupMember>> GetGroupUserAsync(int stakeholderId, SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);

        var result = await connection.QueryAsync<GroupMember>(
            "usr.GetUserGroup",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);

        return result.ToList();
    }
    
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