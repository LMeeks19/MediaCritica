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
builder.Services.AddControllers();
builder.Services.AddMvc().AddControllersAsServices();

// Register Controllers
builder.Services.AddScoped<IControllers, Controllers>();

// Register Mappers
builder.Services.AddScoped<IMappers, Mappers>();
builder.Services.AddScoped<UserMapper>();
builder.Services.AddScoped<SeasonMapper>();
builder.Services.AddScoped<SeriesMapper>();
builder.Services.AddScoped<EpisodeMapper>();
builder.Services.AddScoped<GameMapper>();
builder.Services.AddScoped<MovieMapper>();
builder.Services.AddScoped<MediaMapper>();
builder.Services.AddScoped<RatingMapper>();
builder.Services.AddScoped<ReviewMapper>();
builder.Services.AddScoped<BacklogMapper>();

// Register Helpers
builder.Services.AddScoped<IHelpers, Helpers>();
builder.Services.AddScoped<IDateTimeProviderHelper, DateTimeProviderHelper>();
builder.Services.AddScoped<DateTimeProviderHelper>();
builder.Services.AddScoped<DateRangeCalculatorHelper>();
builder.Services.AddScoped<ExternalApiHelper>();
builder.Services.AddScoped<InternalApiHelper>();
builder.Services.AddScoped<MilestoneCalculatorHelper>();
builder.Services.AddScoped<TrendCalculatorHelper>();

//Register Hubs
builder.Services.AddScoped<IHubs, Hubs>();
builder.Services.AddScoped<NotificationHub>();

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
