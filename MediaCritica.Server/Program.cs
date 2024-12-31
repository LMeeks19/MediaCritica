using MediaCritica.Server;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Load .env file
DotNetEnv.Env.Load();

//Configure connection string from environment variable
var api_key = Environment.GetEnvironmentVariable("MEDIA_SERVICE_API_KEY");

//Add connection string to the applications configuration system
builder.Configuration.AddInMemoryCollection(new Dictionary<string, string> { { "API_KEYS:MEDIA_SERIVE", api_key } });

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddMvc().AddControllersAsServices();

// Add Mappers to Servies
builder.Services.AddScoped<SeasonMapper>();
builder.Services.AddScoped<SeriesMapper>();
builder.Services.AddScoped<EpisodeMapper>();
builder.Services.AddScoped<MovieMapper>();
builder.Services.AddScoped<MediaMapper>();
builder.Services.AddScoped<GameMapper>();
builder.Services.AddScoped<ReviewMapper>();
builder.Services.AddScoped<BacklogMapper>();
builder.Services.AddScoped<RatingMapper>();

builder.Services.AddScoped<IMapper, Mapper>();

// Add Helpers to Services
builder.Services.AddScoped<ExternalApiHelper>();
builder.Services.AddScoped<InternalApiHelper>();


builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer("Server=localhost;Database=MediaCriticaDB;Trusted_Connection=True;TrustServerCertificate=True;"));

var app = builder.Build();

app.UseCors(s => s.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
