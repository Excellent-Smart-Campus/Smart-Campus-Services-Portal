namespace SmartCampusServicesPortal.Data.Repositories;

/// <summary>
///     Initializes a new instance of the <see cref="BaseRepository" /> class.
/// </summary>
public class BaseRepository(string connectionString)
{
    internal const int DefaultTimeout = 5000;
    private readonly string _connectionString;

    /// <summary>
    ///     Initializes a new instance of the <see cref="BaseRepository" /> class.
    /// </summary>
    protected BaseRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    /// <summary>
    ///     Gets a database connection string.
    /// </summary>
    /// <returns><see cref="Task{SqlConnection}" />.</returns>
    protected async Task<SqlConnection> GetOpenConnectionAsync()
    {
        SqlConnection connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        return connection;
    }

    /// <summary>
    ///     Gets a database connection string.
    /// </summary>
    /// <returns><see cref="SqlConnection" />.</returns>
    protected SqlConnection GetOpenConnection()
    {
        SqlConnection connection = new SqlConnection(_connectionString);
        connection.Open();
        return connection;
    }
}