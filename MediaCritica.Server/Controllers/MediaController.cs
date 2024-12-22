using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        private readonly ReviewController _reviewController;
        private readonly string _apiKey;

        public MediaController(DatabaseContext databaseContext, IConfiguration configuration, ReviewController reviewController)
        {
            _databaseContext = databaseContext;
            _reviewController = reviewController;
            _apiKey = configuration.GetSection("API_KEYS:MEDIA_SERIVE").Value!;
        }

        [HttpGet(Name = "GetMediaBySearch")]
        [Route("[action]/{searchTerm}/{page}")]
        public async Task<MediaSearchResultResponse> GetMediaBySearch(string searchTerm, int page)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?s={searchTerm}&page={page}&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var mediaSearchResultResponse = JsonSerializer.Deserialize<MediaSearchResultResponse>(stringResponse);

            return mediaSearchResultResponse!;
        }

        [HttpGet(Name = "GetMovie")]
        [Route("[action]/{mediaId}")]
        public async Task<MovieModel> GetMovie(string mediaId)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={mediaId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var movieModel = JsonSerializer.Deserialize<MovieModel>(stringResponse);

            movieModel!.Reviews.AddRange(await _reviewController.GetMediaReviews(mediaId, 0, 10));

            return movieModel!;
        }

        [HttpGet(Name = "GetSeries")]
        [Route("[action]/{mediaId}")]
        public async Task<SeriesModel> GetSeries(string mediaId)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={mediaId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var seriesModel = JsonSerializer.Deserialize<SeriesModel>(stringResponse);

            seriesModel!.Seasons.Add(await GetSeason(mediaId));
            seriesModel!.Reviews.AddRange(await _reviewController.GetMediaReviews(mediaId, 0, 10));

            return seriesModel!;
        }

        [HttpGet(Name = "GetSeason")]
        [Route("[action]/{mediaId}/{season}")]
        public async Task<SeasonModel> GetSeason(string mediaId, int season = 1)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={mediaId}&season={season}&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var seasonModel = JsonSerializer.Deserialize<SeasonModel>(stringResponse);

            return seasonModel!;
        }

        [HttpGet(Name = "GetGame")]
        [Route("[action]/{mediaId}")]
        public async Task<GameModel> GetGame(string mediaId)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={mediaId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var gameModel = JsonSerializer.Deserialize<GameModel>(stringResponse);

            gameModel!.Reviews.AddRange(await _reviewController.GetMediaReviews(mediaId, 0, 10)); ;

            return gameModel!;
        }

        [HttpGet(Name = "GetEpisode")]
        [Route("[action]/{mediaId}")]
        public async Task<EpisodeModel> GetEpisode(string mediaId)
        {
            var response = await new HttpClient().GetAsync($"https://www.omdbapi.com/?i={mediaId}&plot=full&apikey={_apiKey}");
            var stringResponse = await response.Content.ReadAsStringAsync();
            var episodeModel = JsonSerializer.Deserialize<EpisodeModel>(stringResponse);

            return episodeModel!;
        }
    }
}
