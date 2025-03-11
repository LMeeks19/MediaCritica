using MediaCritica.Server;
using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Hubs;
using MediaCritica.Server.Mappers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load .env file
DotNetEnv.Env.Load();

// Configure connection string from environment variable
var api_key = Environment.GetEnvironmentVariable("MEDIA_SERVICE_API_KEY");

// Add connection string to the applications configuration system
builder.Configuration.AddInMemoryCollection(new Dictionary<string, string> { { "API_KEYS:MEDIA_SERIVE", api_key } });

// Add services to the container.
builder.Services.AddSignalR();

builder.Services.AddScoped<IControllers, Controllers>();
builder.Services.AddScoped<IMappers, Mappers>();
builder.Services.AddScoped<IHelpers, Helpers>();
builder.Services.AddScoped<IHubs, Hubs>();

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer("Server=localhost;Database=MediaCriticaDB;Trusted_Connection=True;TrustServerCertificate=True;"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseWebSockets();
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationHub>("/NotificationHub");
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
