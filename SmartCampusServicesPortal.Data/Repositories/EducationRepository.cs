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
    
    public async Task<IEnumerable<SubjectLecture>> GetRegisteredSubjectLecturersAsync(int subjectId)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@subjectId", subjectId);
        
        return await connection.QueryAsync<SubjectLecture>(
            "edu.GetRegisteredSubjectLecturers",
            commandType: CommandType.StoredProcedure,
            param: queryParameters);
    }
    
    public async Task<IEnumerable<Course>> GetStakeholderCourseAndSubjectsAsync(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType){
        await using SqlConnection connection = await GetOpenConnectionAsync();
        
        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@stakeholderRelationshipTypeId", (int?)stakeholderRelationshipType);
        
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

        return courseSubjectsDictionary.Values;
    }

    public async Task<IEnumerable<RegisteredStakeholder>> GetRegisteredStakeholderAsync(StakeholderType stakeholderType)
    {
        await using SqlConnection connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderType", (int)stakeholderType);
        
        return await connection.QueryAsync<RegisteredStakeholder>(
             "edu.GetRegisteredStakeholder",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
    }
    
    public async Task<TimeTable> GetTimeTableAsync(int stakeholderId, StakeholderRelationshipType? stakeholderRelationshipType){
        await using SqlConnection connection = await GetOpenConnectionAsync();

        var queryParameters = new DynamicParameters();
        queryParameters.Add("@stakeholderId", stakeholderId);
        queryParameters.Add("@stakeholderRelationshipTypeId", (int?)stakeholderRelationshipType);
        
        Dictionary<int, TimeTable> timeTableDictionary = new Dictionary<int, TimeTable>();
        
        await connection.QueryAsync<TimeTable, WeekDays, Schedule, TimeTable>(
             "edu.GetTimeTable",
            (timeTable, weekdays, schedule) =>
            {
                if (!timeTableDictionary.TryGetValue(timeTable.CourseId, out TimeTable timeTableInstance))
                {
                    timeTableInstance = timeTable;
                    timeTableDictionary.Add(timeTable.CourseId, timeTableInstance);
                }
                
                WeekDays weekDaysInstance = timeTableInstance.WeekDays
                    .FirstOrDefault(i => i.DayOfWeekTypeId == weekdays.DayOfWeekTypeId);

                if (weekDaysInstance == null)
                {
                    weekDaysInstance = new WeekDays
                    {
                        DayOfWeekTypeId = weekdays.DayOfWeekTypeId,
                        DayOfWeekType = weekdays.DayOfWeekType
                    };
                    timeTableInstance.WeekDays.Add(weekDaysInstance);  
                }
                
                Schedule scheduleInstance = timeTableInstance.WeekDays
                    .FirstOrDefault(i => i.DayOfWeekTypeId == weekdays.DayOfWeekTypeId)
                    .Schedules.FirstOrDefault(s => s.SubjectId == schedule.SubjectId);
                
                if (scheduleInstance == null)
                {
                    scheduleInstance = new Schedule
                    {
                        SubjectId = schedule.SubjectId,
                        SubjectCode = schedule.SubjectCode,
                        SubjectName = schedule.SubjectName,
                        TimetableId = schedule.TimetableId,
                        EndTime = schedule.EndTime,
                        StartTime = schedule.StartTime, 
                        RoomId  = schedule.RoomId,
                        RoomNumber = schedule.RoomNumber,
                        RoomType = schedule.RoomType,
                        Location = schedule.Location                  
                    };
                    
                    weekDaysInstance.Schedules.Add(scheduleInstance);
                }
                return timeTable;
            },
            splitOn: "DayOfWeekTypeId, TimetableId",
            commandType: CommandType.StoredProcedure,
            param: queryParameters,
            commandTimeout: DefaultTimeout
        );
        
        return timeTableDictionary.Values.FirstOrDefault();
    }
}