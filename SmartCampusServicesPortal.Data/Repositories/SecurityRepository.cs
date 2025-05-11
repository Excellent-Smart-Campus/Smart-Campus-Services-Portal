using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using SmartCampusServicesPortal.Data.Models;

namespace SmartCampusServicesPortal.Data.Repositories;

public class SecurityRepository(string connectionString) : BaseRepository(connectionString)
{
    public async Task<SecurityUser> GetSecurityUserAsync(long? stakeholderId, string userName,
        bool excludeMembersAndActions = false)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;

        var user = await GetSecurityUserAsync(stakeholderId, userName, connection, transaction);

        if (user != null && !excludeMembersAndActions)
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

    public async Task<List<GroupAction>> GetGroupActionsById(int groupdId)
    {
        await using var connection = await GetOpenConnectionAsync();
        return await GetGroupActionsAsync(groupdId, connection);
    }

    public async Task<IEnumerable<Models.User>> GetAllUsersAsync()
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await connection.QueryAsync<Models.User>(
            "usr.GetAllUsers",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Models.Group>> GetGroupAsync(int? groupId = null)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@groupId", groupId);

        return await connection.QueryAsync<Models.Group>(
            "usr.GetGroup",
            param: queryParameters,
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<Models.Action>> GetAllActionsAsync()
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await connection.QueryAsync<Models.Action>(
            "usr.GetAllActions",
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<StakeholderPerson>> GetUserDetailsAsync(int stakeholderId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholder", stakeholderId);

        Dictionary<int, StakeholderPerson> stakeholderPersonDictionary = new Dictionary<int, StakeholderPerson>();

        await connection.QueryAsync<StakeholderPerson, StakeholderContact, Course, Subject, StakeholderPerson>(
            "usr.GetUser", 
            (person, contacts, course, subjects) =>
            {
                if (!stakeholderPersonDictionary.TryGetValue(person.StakeholderId.Value,
                        out StakeholderPerson stakeholderPersonInstance))
                {
                    stakeholderPersonInstance = person;
                    stakeholderPersonInstance.Contacts = new List<StakeholderContact>();
                    stakeholderPersonInstance.Courses = new List<Course>();
                    stakeholderPersonDictionary.Add(stakeholderPersonInstance.StakeholderId.Value, stakeholderPersonInstance);
                }

                StakeholderContact contactInstance = stakeholderPersonInstance.Contacts
                    .FirstOrDefault(i => i.ContactId == contacts.ContactId);

                if (contactInstance == null)
                {
                    contactInstance = new StakeholderContact
                    {
                        Detail = contacts.Detail,
                        ContactTypeId = contacts.ContactTypeId,
                        ContactId = contacts.ContactId,
                    };
                    stakeholderPersonInstance.Contacts.Add(contactInstance);
                }

                Course courseInstance = stakeholderPersonInstance.Courses
                    .FirstOrDefault(i => i.CourseId == course.CourseId);

                if (courseInstance == null)
                {
                    courseInstance = new Course
                    {
                        CourseId = course.CourseId,
                        CourseCode = course.CourseCode,
                        CourseName = course.CourseName
                    };
                    stakeholderPersonInstance.Courses.Add(courseInstance);
                } 
                Subject subjectsInstance = courseInstance.Subjects
                    .FirstOrDefault(i => i.SubjectId == subjects.SubjectId);
                
                if (subjectsInstance == null)
                {
                    subjectsInstance = new Subject
                    {
                        SubjectId = subjects.SubjectId,
                        IsMandatory = subjects.IsMandatory,
                        SubjectCode = subjects.SubjectCode,
                        SubjectName = subjects.SubjectName,
                    };
                    
                    courseInstance.Subjects.Add(subjectsInstance);
                }

                return person;
            },
            splitOn: "ContactId, CourseId, SubjectId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
        
        return stakeholderPersonDictionary.Values;
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