using MediaCritica.Server.Models;
using System.Text.Json;

namespace MediaCritica.Server.Helpers
{
    public class ExternalApiHelper(IConfiguration configuration, bool isTestEnvironment = false)
    {
        private readonly string? _apiKey = isTestEnvironment ? null : configuration.GetSection("API_KEYS:MEDIA_SERIVE").Value;
        private readonly bool _isTestEnvironment = isTestEnvironment;

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
                    response = "True",
                    search = searchResults,
                    totalResults = searchResults.Count.ToString()
                };
            }
            else
            {
                var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?s={searchTerm}&page={page}&apikey={_apiKey}");
                var stringResponse = await response.Content.ReadAsStringAsync();
                var mediaSearchResultResponse = JsonSerializer.Deserialize<MediaSearchResultResponse>(stringResponse);
                return mediaSearchResultResponse;
            }
        }

        public async Task<MovieModel?> GetMovieMedia(string movieId)
        {
            if (_isTestEnvironment)
                return null;

            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={movieId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var movieModel = JsonSerializer.Deserialize<MovieModel>(stringResponse);
            return movieModel;
        }

        public async Task<GameModel?> GetGameMedia(string gameId)
        {
            if (_isTestEnvironment)
                return null;

            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={gameId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var gameModel = JsonSerializer.Deserialize<GameModel>(stringResponse);
            return gameModel;
        }

        public async Task<SeriesModel?> GetSeriesMedia(string seriesId)
        {
            if (_isTestEnvironment)
                return null;

            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={seriesId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var seriesModel = JsonSerializer.Deserialize<SeriesModel>(stringResponse);
            return seriesModel;
        }

        public async Task<SeasonModel?> GetSeasonMedia(string seriesId, int season)
        {
            if (_isTestEnvironment)
                return null;

            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={seriesId}&season={season}&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var seasonModel = JsonSerializer.Deserialize<SeasonModel>(stringResponse);
            return seasonModel;
        }

        public async Task<EpisodeModel?> GetEpisodeMedia(string episodeId)
        {
            if (_isTestEnvironment)
                return null;

            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={episodeId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var episodeModel = JsonSerializer.Deserialize<EpisodeModel>(stringResponse);
            return episodeModel;
        }
    }
}
