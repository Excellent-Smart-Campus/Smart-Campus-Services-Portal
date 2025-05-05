using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using SmartCampusServicesPortal.Data.Enums;
using SmartCampusServicesPortal.Data.Models;

namespace SmartCampusServicesPortal.Data.Repositories;

public class EducationRepository(string connectionString) : BaseRepository(connectionString)
{
    public async Task<IEnumerable<Course>> GetCourseByIdAsync(int? courseId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", courseId);
        
        return await connection.QueryAsync<Course>(
            "edu.GetCourseById",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }
    
    public async Task<Course> GetSubjectAndCourseByIdAsync(int? subjectId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@subjectId", subjectId);
        
        Dictionary<int, Course> courseSubjectsDictionary =
            new Dictionary<int, Course>();
        
        await connection.QueryAsync<Course, Subject, Course>(
            "edu.GetCourseSubjectsById",
            (course, subjects) =>
            {
                if (!courseSubjectsDictionary.TryGetValue(course.CourseId, out Course courseInstance))
                {
                    courseInstance = course;
                    courseSubjectsDictionary.Add(course.CourseId, courseInstance);
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
                return course;
            },
            splitOn: "SubjectId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
        
        return courseSubjectsDictionary.Values.FirstOrDefault();
    }
    
    public async Task<IEnumerable<Subject>> GetSubjectsByCourseIdAsync(int? courseId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@courseId", courseId);
        
        return await connection.QueryAsync<Subject>(
            "edu.GetSubjectsByCourseId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }

    public async Task<Course> GetStakeholderCourseAndSubjectsAsyn(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType){
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@stakeholderRelationshipTypeId", (int)stakeholderRelationshipType);
        
        Dictionary<int, Course> courseSubjectsDictionary =
            new Dictionary<int, Course>();
        
        await connection.QueryAsync<Course, Subject, Course>(
            "edu.GetStakeholderCourseAndSubjects",
            (course, subjects) =>
            {
                if (!courseSubjectsDictionary.TryGetValue(course.CourseId, out Course courseInstance))
                {
                    courseInstance = course;
                    courseSubjectsDictionary.Add(course.CourseId, courseInstance);
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
                return course;
            },
            splitOn: "SubjectId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
        
        return courseSubjectsDictionary.Values.FirstOrDefault();
    }

    public async Task<TimeTable> GetTimeTableAsync(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType){
        await using SqlConnection connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@stakeholderRelationshipTypeId", (int)stakeholderRelationshipType);
        
        Dictionary<int, TimeTable> timeTableDictionary = new Dictionary<int, TimeTable>();
        
        await connection.QueryAsync<TimeTable, SubjectSchedule, TimeTable>(
             "edu.GetStakeholderCourseAndSubjects",
            (timeTable, subjectSchedule) =>
            {
                if (!timeTableDictionary.TryGetValue(timeTable.CourseId, out TimeTable timeTableInstance))
                {
                    timeTableInstance = timeTable;
                    timeTableDictionary.Add(timeTable.CourseId, timeTableInstance);
                }
                
                SubjectSchedule subjectScheduleInstance = timeTableInstance.SubjectSchedules
                    .FirstOrDefault(i => i.SubjectId == subjectSchedule.SubjectId);
                
                if (subjectScheduleInstance == null)
                {
                    subjectScheduleInstance = new SubjectSchedule
                    {
                        SubjectId = subjectSchedule.SubjectId,
                        SubjectCode = subjectSchedule.SubjectCode,
                        SubjectName = subjectSchedule.SubjectName,
                        TimetableId = subjectSchedule.TimetableId,
                        DayOfWeekType = subjectSchedule.DayOfWeekType,
                        DayOfWeekTypeId = subjectSchedule.DayOfWeekTypeId,
                        EndTime = subjectSchedule.EndTime,
                        StartTime = subjectSchedule.StartTime, 
                        RoomId  = subjectSchedule.RoomId,
                        RoomNumber = subjectSchedule.RoomNumber,
                        RoomType = subjectSchedule.RoomType,
                        Location = subjectSchedule.Location                  
                    };
                    
                    timeTableInstance.SubjectSchedules.Add(subjectScheduleInstance);
                }
                return timeTable;
            },
            splitOn: "SubjectId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
        
        return timeTableDictionary.Values.FirstOrDefault();
    }
}