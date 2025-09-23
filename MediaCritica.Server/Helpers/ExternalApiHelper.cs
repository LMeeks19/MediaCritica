using MediaCritica.Server.Models;
using System.Text.Json;

namespace MediaCritica.Server.Helpers
{
    public class ExternalApiHelper(IConfiguration configuration, ImageValidator imageValidator, bool isTestEnvironment = false)
    {
        private readonly string? _apiKey = isTestEnvironment ? null : configuration.GetSection("API_KEYS:MEDIA_SERIVE").Value;
        private readonly bool _isTestEnvironment = isTestEnvironment;
        private readonly ImageValidator _imageValidator = imageValidator;

        public async Task<MediaSearchResultResponse?> GetSearchMedia(string searchTerm, int page)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "MediaExternalSearchTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<List<MediaSearchModel>>(stringResponse);

                if (jsonData == null)
                    return null;

                var searchResults = jsonData.Where(m => m.Title.StartsWith(searchTerm)).ToList();
                return new MediaSearchResultResponse()
                {
                    Response = "True",
                    Search = searchResults,
                    totalResults = searchResults.Count.ToString()
                };
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?s={searchTerm}&page={page}&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var mediaSearchResultResponse = JsonSerializer.Deserialize<MediaSearchResultResponse>(stringResponse);
                foreach (var media in mediaSearchResultResponse.Search)
                {
                    media.Poster = await _imageValidator.GetValidImageUrlAsync(media.Poster!.ToString());
                }
                return mediaSearchResultResponse;
            }
        }

        public async Task<MovieModel?> GetMovieMedia(string movieId)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "GetMovieTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<MovieModel>(stringResponse);
                if (jsonData.Id == movieId)
                    return jsonData;
                return null;
            }
            else
            {

                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={movieId}&plot=full&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var movieModel = JsonSerializer.Deserialize<MovieModel>(stringResponse);
                return movieModel;
            }
        }

        public async Task<GameModel?> GetGameMedia(string gameId)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "GetGameTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<GameModel>(stringResponse);
                if (jsonData.Id == gameId)
                    return jsonData;
                return null;
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={gameId}&plot=full&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var gameModel = JsonSerializer.Deserialize<GameModel>(stringResponse);
                return gameModel;
            }
        }

        public async Task<SeriesModel?> GetSeriesMedia(string seriesId)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "GetSeriesTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<SeriesModel>(stringResponse);
                if (jsonData.Id == seriesId)
                    return jsonData;
                return null;
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={seriesId}&plot=full&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var seriesModel = JsonSerializer.Deserialize<SeriesModel>(stringResponse);
                return seriesModel;
            }
        }

        public async Task<SeasonModel?> GetSeasonMedia(string seriesId, int season)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "GetSeasonTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<SeasonModel>(stringResponse);
                if (jsonData.SeriesId == seriesId)
                    return jsonData;
                return null;
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={seriesId}&season={season}&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var seasonModel = JsonSerializer.Deserialize<SeasonModel>(stringResponse);
                return seasonModel;
            }
        }

        public async Task<EpisodeModel?> GetEpisodeMedia(string episodeId)
        {
            if (_isTestEnvironment)
            {
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Testing", "Data", "GetEpisodeTestData.json");
                var stringResponse = File.ReadAllText(filePath);
                var jsonData = JsonSerializer.Deserialize<EpisodeModel>(stringResponse);
                if (jsonData.Id == episodeId)
                    return jsonData;
                return null;
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={episodeId}&plot=full&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var episodeModel = JsonSerializer.Deserialize<EpisodeModel>(stringResponse);
                return episodeModel;
            }
        }
    }
}
