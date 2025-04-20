namespace DefaultNamespace;

public class StringExtentions
{
    public static string ToFilter(this string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return null;
        }

        return value + "%";
    }
}