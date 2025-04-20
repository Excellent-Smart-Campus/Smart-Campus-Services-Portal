using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SmartCampusServicesPortal.Data.Models;
using SmartCampusServicesPortal.Domain;
using SmartCampusServicesPortal.Domain.Manager;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<RouteOptions>(o => { o.LowercaseUrls = true; });

builder.Services.AddControllers();

builder.Services.AddAuthentication(o =>
    {
        o.DefaultScheme = IdentityConstants.ApplicationScheme;
        o.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddIdentityCookies(s =>
    {
        s.ApplicationCookie.Configure(options =>
        {
            options.Cookie.HttpOnly = true;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.ExpireTimeSpan = TimeSpan.FromDays(2);
            options.SlidingExpiration = true;
            options.Events.OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                }

                return Task.CompletedTask;
            };
            options.Events.OnRedirectToAccessDenied = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                }
                return Task.CompletedTask;
            };
        });
    });

builder.Services.AddIdentityCore<ApplicationUser>(config =>
    {
        // Password settings.
        config.Password.RequireDigit = true;
        config.Password.RequireLowercase = true;
        config.Password.RequireNonAlphanumeric = true;
        config.Password.RequireUppercase = true;
        config.Password.RequiredLength = 12;
        config.Password.RequiredUniqueChars = 1;

        // User settings.
        config.User.RequireUniqueEmail = true;
    })
    .AddUserManager<UserManager<ApplicationUser>>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddDefaultTokenProviders();

builder.Services.AddTransient<IUserStore<ApplicationUser>, ApplicationUserStore>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDomain(builder.Configuration);

WebApplication app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapFallbackToFile("/index.html");
app.Run();