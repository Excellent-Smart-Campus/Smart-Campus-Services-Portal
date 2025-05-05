using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;

namespace SmartCampusServicesPortal.Data.Repositories;

public class StakeholderRepository(string connectionString) : BaseRepository(connectionString)
{
    public async Task<Stakeholder> CreateUserAndStakeholder(Stakeholder stakeholder,StakeholderPerson person, 
        List<StakeholderContact> contacts, StakeholderRelationship relatedStakeholder, List<int> subjects)
    {
        await using var connection = await GetOpenConnectionAsync();
        await using var transaction = await connection.BeginTransactionAsync() as SqlTransaction;
        
        var dbContacts = stakeholder.StakeholderId.HasValue
            ? await GetStakeholderContactsAsync(stakeholder.StakeholderId!.Value)
            : new List<StakeholderContact>();
        
        /* User Stakeholder  */
        var dbStakeholder = await SetStakeholder(stakeholder, connection, transaction);

        person.StakeholderId = dbStakeholder.StakeholderId.Value;
        await SetStakeholderPersonAsync(person, connection, transaction);
        
        /* Set User Contacts */
        await SetContacts(contacts, dbStakeholder.StakeholderId.Value, (List<StakeholderContact>)dbContacts, connection, transaction);

        foreach (var subject in subjects)
        {
            await SetStakeholderSubjectAsync(subject, dbStakeholder.StakeholderId.Value, false, connection, transaction);
        }
        
        relatedStakeholder.StakeholderId = dbStakeholder.StakeholderId.Value;
        await SetStakeholderRelationshipAsync(relatedStakeholder, connection, transaction);

        transaction.Commit();
        return dbStakeholder;
    }
    
    public async Task<IEnumerable<StakeholderContact>> GetStakeholderContactsAsync(
        int? stakeholderId = null, string email = null, ContactType? contactType = null)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();

        DynamicParameters queryParameters = new();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@email", email);
        queryParameters.Add("@contactTypeId", (int?)contactType);

        IEnumerable<StakeholderContact> result = await connection.QueryAsync<StakeholderContact>(
            "sh.[GetStakeholderContact]",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout);

        return result;
    }

    public async Task<IEnumerable<UserTitle>> GetUserTitlesAsync()
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await connection.QueryAsync<UserTitle>(
            "sh.GetTitles",
            commandType: CommandType.StoredProcedure);
    }
    
    public async Task<Stakeholder> GetStakeholdersByStakeholderId(int stakeholderId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync(); ;

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);

        return await connection.QueryFirstOrDefaultAsync<Stakeholder>(
            "sh.GetStakeholder",
            param: queryParameters,
            commandType: CommandType.StoredProcedure
        );
    }
    
    public async Task<StakeholderPerson> GetStakeholderPersonAsync(int stakeholderId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        
        return await connection.QueryFirstOrDefaultAsync<StakeholderPerson>(
            "sh.GetStakeholderPerson",
            commandType: CommandType.StoredProcedure);
    }
    
    public async Task<Stakeholder> SetStakeholder(Stakeholder stakeholder)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await SetStakeholder(stakeholder, connection);
    }
    
    public async Task<StakeholderRelationship> SetStakeholderRelationship(StakeholderRelationship stakeholderRelationship)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        return await SetStakeholderRelationshipAsync(stakeholderRelationship, connection);
    }
    
    private async Task SetContacts(List<StakeholderContact> contacts, int stakeholderId, List<StakeholderContact> dbContacts, SqlConnection connection, SqlTransaction transaction)
    {
        foreach (var contact in contacts)
        {
            contact.ContactId = dbContacts.FirstOrDefault(c => c.ContactTypeId == contact.ContactTypeId
                                                               && c.Detail == contact.Detail)?.ContactId;

            await SetStakeholderContactAsync(contact, stakeholderId, connection, transaction);
        }
    }
    
    private async Task<StakeholderPerson> SetStakeholderPersonAsync(StakeholderPerson stakeholderPerson, SqlConnection connection,
        SqlTransaction transaction = null )
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderPerson.StakeholderId);
        queryParameters.Add("@titleId", stakeholderPerson.TitleId);
        queryParameters.Add("@firstName", stakeholderPerson.FirstName);
        queryParameters.Add("@lastName", stakeholderPerson.LastName);
        
        return await connection.QueryFirstOrDefaultAsync<StakeholderPerson>(
            "sh.SetStakeholderPerson",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
    
    private async Task<Stakeholder> SetStakeholder(Stakeholder stakeholder, SqlConnection connection,
        SqlTransaction transaction = null)
    { 
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholder.StakeholderId);
        queryParameters.Add("@stakeholderTypeId", stakeholder.StakeholderTypeId);
        queryParameters.Add("@name", stakeholder.Name);

        return await connection.QueryFirstOrDefaultAsync<Stakeholder>(
            "sh.SetStakeholder",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
    
    private async Task<StudentSubject> SetStakeholderSubjectAsync(int subjectId, int stakeholderId, bool isDeleted, 
        SqlConnection connection, SqlTransaction transaction = null)
    { 
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@subjectId", subjectId);
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@isDeleted", isDeleted);

        return await connection.QueryFirstOrDefaultAsync<StudentSubject>(
            "edu.SetStakeholderSubject",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
    
    private async Task<StakeholderContact> SetStakeholderContactAsync(StakeholderContact contact, int stakeholder, SqlConnection connection,
        SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholder);
        queryParameters.Add("@contactId", contact.ContactId);
        queryParameters.Add("@contactTypeId", (int)contact.ContactTypeId);
        queryParameters.Add("@detail", contact.Detail);
        queryParameters.Add("@areaCode", contact.AreaCode);

        var result = await connection.QueryFirstOrDefaultAsync<StakeholderContact>(
            "sh.SetStakeholderContact",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);

        return result;
    }
    
    private async Task<StakeholderRelationship> SetStakeholderRelationshipAsync(StakeholderRelationship stakeholderRelationship, 
        SqlConnection connection, SqlTransaction transaction = null)
    {
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderRelationship.StakeholderId);
        queryParameters.Add("@relatedStakeholderId", stakeholderRelationship.RelatedStakeholderId);
        queryParameters.Add("@stakeholderRelationshipTypeId", (int)stakeholderRelationship.StakeholderRelationshipTypeId);

        return await connection.QueryFirstOrDefaultAsync<StakeholderRelationship>(
            "sh.SetStakeholderRelationship",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            transaction: transaction,
            commandTimeout: DefaultTimeout);
    }
}