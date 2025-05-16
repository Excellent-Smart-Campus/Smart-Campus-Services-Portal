using Microsoft.Identity.Client;

namespace SmartCampusServicesPortal.Server.Utils;

public class ErrorMessagesConstant
{
    public const string UnexpectedError = "Something went wrong. Please try again later.";
    public const string UserAlreadyLoggedIn = "User is already logged in.";
    public const string NoUserFound = "No matching account found.";
    public const string NoPermissionToLogIn = "You do not have permission to log into the system.";
    public const string AccountLocked = "Your account is locked. Please contact support";
    public const string ManyAttemptsLockAccount = "Your account has been locked due to too many failed attempts. Please contact support";
    public const string InvalidCredentials = "Incorrect username or password.";
    public const string ScheduleSuccess = "Schedule request submitted successfully.";
    public const string ScheduleConfirmed = "Appointment booking confirmed successfully.";
    public const string ScheduleError = "Failed to submit schedule request.";
    public const string EmailAlreadyExists = "An account already exists.";
    public const string RegistrationError = "Registration failed. Please try again.";
    public const string RegistrationSuccess = "Registration completed successfully.";
    public const string LoginSuccess = "You’ve successfully logged in.";
    public const string AccountStatusSuccess = "Account unblocked successfully, user can login";
    public const string AccountStatusFailure = " Account Failed to unblock";
    public const string MaintenanceUpdateFail = "Maintenance failed to update, try again later";
    public const string MaintenanceUpdateSuccess = "Maintenance Updated Successfully";
    public const string BookingUpdateFail = "Booking failed to update, try again later";
    public const string BookingUpdateSuccess = "Booking Updated Successfully";

}