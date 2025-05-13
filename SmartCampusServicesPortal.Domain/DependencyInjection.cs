using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartCampusServicesPortal.Data.Repositories;
using SmartCampusServicesPortal.Data.Utils;
using SmartCampusServicesPortal.Domain.Manager;
using Microsoft.Extensions.Azure;

namespace SmartCampusServicesPortal.Domain;

public static class DependencyInjection
{
    public static IServiceCollection AddDomain(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("SmartCampusDb");  
        
        SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());
        services.AddScoped(_ => new SecurityRepository(connectionString));
        services.AddScoped(_ => new StakeholderRepository(connectionString));
        services.AddScoped(_ => new EducationRepository(connectionString));
        services.AddScoped(_ => new ServiceRepository(connectionString));
        services.AddScoped<StakeholderManager>();
        services.AddScoped<EducationManager>();
        services.AddScoped<ServiceManager>();
        return services;
    }
}