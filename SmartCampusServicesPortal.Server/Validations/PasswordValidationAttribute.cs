using NetTopologySuite.Algorithm;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace SmartCampusServicesPortal.Server.Validations;

public class PasswordValidationAttribute : ValidationAttribute
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="value"></param>
    /// <param name="validationContext"></param>
    /// <returns></returns>
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var password = value as string;

        if (string.IsNullOrEmpty(password))
            return new ValidationResult("Password is required.");

        // Minimum length of 12 characters
        if (password.Length < 12)
            return new ValidationResult("Password must be at least 8 characters long.");

        // At least one uppercase letter
        if (!Regex.IsMatch(password, "[A-Z]"))
            return new ValidationResult("Password must contain at least one uppercase letter.");

        // At least one lowercase letter
        if (!Regex.IsMatch(password, "[a-z]"))
            return new ValidationResult("Password must contain at least one lowercase letter.");

        // At least one digit
        if (!Regex.IsMatch(password, @"\d"))
            return new ValidationResult("Password must contain at least one digit.");

        // At least one special character
        if (!Regex.IsMatch(password, @"[!@#$%^&*(),.?""\\:{}|<>]"))
            return new ValidationResult("Password must contain at least one special character.");

        return ValidationResult.Success;
    }
}