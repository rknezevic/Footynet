using System.Data;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Footynet.Data;
using Footynet.Models;
using Footynet.Repository;
using Footynet.Repository.Interfaces;
using Footynet.Service;
using Footynet.Service.Interfaces;
using Footynet.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog: console everywhere, rolling files only in Development
// (container file systems in hosting are ephemeral; the platform collects console output)
var loggerConfig = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Warning)
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}");
if (builder.Environment.IsDevelopment())
{
    loggerConfig.WriteTo.File("Logs/footynet-.log", rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}");
}
Log.Logger = loggerConfig.CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddDbContext<FootynetDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IDbConnection>(provider =>
    new NpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository pattern
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJobAdRepository, JobAdRepository>();
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<IClubRepository, ClubRepository>();
builder.Services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();

// Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IJobAdService, JobAdService>();
builder.Services.AddScoped<IClubService, ClubService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<LoginDtoValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Footynet API",
        Version = "v1",
        Description = "Football Player-Club Connection Platform"
    });
    
    // JWT Authentication in Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        policy.WithOrigins(allowedOrigins is { Length: > 0 } ? allowedOrigins : ["http://localhost:3000"])
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    app.Lifetime.ApplicationStarted.Register(() =>
    {
        var url = app.Urls.FirstOrDefault() ?? "http://localhost:5067";
        var swaggerUrl = $"{url}/swagger";
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = swaggerUrl,
            UseShellExecute = true
        });
    });
}



// The frontend calls the API over plain http in development (NEXT_PUBLIC_API_URL); redirecting
// to https there would send a redirect without CORS headers and the browser would block it
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseSerilogRequestLogging();
app.UseMiddleware<Footynet.Middleware.ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations and seed admin
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FootynetDbContext>();
    await context.Database.MigrateAsync();
    
    var adminEmail = builder.Configuration["AdminSeed:Email"];
    var adminPassword = builder.Configuration["AdminSeed:Password"];
    var adminExists = await context.Users.AnyAsync(u => u is Admin);
    if (!adminExists && (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword)))
    {
        Log.Warning("No admin user exists and AdminSeed:Email / AdminSeed:Password are not configured; skipping admin seed");
    }
    else if (!adminExists)
    {
        var admin = new Admin
        {
            Id = Guid.NewGuid(),
            Email = adminEmail!,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
        };
        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}

app.Run();
