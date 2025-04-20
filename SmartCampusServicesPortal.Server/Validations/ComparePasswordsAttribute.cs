using System.ComponentModel.DataAnnotations;
namespace SmartCampusServicesPortal.Server.Validations;

public class ComparePasswordsAttribute : ValidationAttribute
{
    private readonly string _comparisonProperty;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="comparisonProperty"></param>
    /// <param name="modeProperty"></param>
    public ComparePasswordsAttribute(string comparisonProperty)
    {
        _comparisonProperty = comparisonProperty;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="value"></param>
    /// <param name="validationContext"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var comparisonProperty = validationContext.ObjectType.GetProperty(_comparisonProperty);

        if (comparisonProperty == null)
        {
            throw new ArgumentException("Property with this name not found");
        }

        var comparisonValue = comparisonProperty.GetValue(validationContext.ObjectInstance);

        if (value == null)
        {
            return new ValidationResult($"{validationContext.DisplayName} is required.");
        }

        if (!string.Equals(value.ToString(), comparisonValue.ToString()))
        {
            return new ValidationResult("Passwords mismatch");
        }

        return ValidationResult.Success;
    }
}
