using System.ComponentModel;

namespace SmartCampusServicesPortal.Data.Utils;

/// <summary>
/// Enum related extension methods 
/// </summary>
public static class EnumExtensions
{
    /// <summary>
    /// Gets the DescriptionAttribute text for an enum value. 
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    public static string GetDescription(this Enum? value)
    {
        if (value == null) return string.Empty;

        var fieldInfo = value.GetType().GetField(value.ToString());

        if (fieldInfo!.GetCustomAttributes(typeof(DescriptionAttribute), false) is DescriptionAttribute[] attributes
            && attributes.Any())
        {
            return attributes.First().Description;
        }

        return value.ToString();
    }
}