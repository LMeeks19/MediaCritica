using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Models.Media_Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MediaController(DatabaseContext databaseContext, ReviewController reviewController, IMapper mapper, ExternalApiHelper externalApiHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly ReviewController _reviewController = reviewController;
        private readonly IMapper _mapper = mapper;
        private readonly ExternalApiHelper _externalApiHelper = externalApiHelper;


        [HttpGet(Name = "GetMediaBySearch")]
        [Route("[action]/{searchTerm}/{page}")]
        public async Task<MediaSearchResultResponse> GetMediaBySearch(string searchTerm, int page)
        {
            return await _externalApiHelper.GetSearchMedia(searchTerm, page);
        }

        [HttpGet(Name = "GetExploreMedia")]
        [Route("[action]/{offset}")]
        public async Task<List<MediaSummaryModel>> GetExploreMedia(int offset)
        {
            var media = await _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode)
                .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                .Skip(offset)
                .Take(100)
                .OrderBy(media => media.Title)
                .ToListAsync();

            return media;

        }

        [HttpGet(Name = "GetMovie")]
        [Route("[action]/{mediaId}")]
        public async Task<MovieModel> GetMovie(string mediaId)
        {
            // TODO:
            var movieModel = await _externalApiHelper.GetMovieMedia(mediaId);
            movieModel!.Reviews.AddRange(await _reviewController.GetMediaReviews(mediaId, 0, 10));
            return movieModel!;
        }

        [HttpGet(Name = "GetSeries")]
        [Route("[action]/{seriesId}")]
        public async Task<SeriesModel> GetSeries(string seriesId)
        {
            var series = _databaseContext.Series
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .Include(series => series.Reviews)
                .SingleOrDefault(series => series.Id == seriesId);

            if (series != null)
                return _mapper.SeriesMapper.MapSeriesModel(series);


            var seriesModel = await _externalApiHelper.GetSeriesMedia(seriesId);

            series = _mapper.SeriesMapper.MapSeries(seriesModel);

            _databaseContext.Series.Add(series);
            await _databaseContext.SaveChangesAsync();

            await GetSeason(seriesId);

            series = _databaseContext.Series
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .Include(series => series.Reviews)
                .Single(series => series.Id == seriesId);

            return _mapper.SeriesMapper.MapSeriesModel(series);
        }

        [HttpGet(Name = "GetSeason")]
        [Route("[action]/{seriesId}/{seasonNo}")]
        public async Task<SeasonModel> GetSeason(string seriesId, int seasonNo = 1)
        {
            var season = _databaseContext.Seasons
                .Include(s => s.Episodes)
                .SingleOrDefault(season => season.SeriesId == seriesId && season.SeasonNo == seasonNo);

            if (season != null)
                return _mapper.SeasonMapper.MapSeasonModel(season);

            var seasonModel = await _externalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            season = _mapper.SeasonMapper.MapSeason(seasonModel!, seriesId);

            _databaseContext.Seasons.Add(season);
            await _databaseContext.SaveChangesAsync();

            return _mapper.SeasonMapper.MapSeasonModel(season);
        }

        [HttpGet(Name = "GetGame")]
        [Route("[action]/{mediaId}")]
        public async Task<GameModel> GetGame(string mediaId)
        {
            // TODO:
            var gameModel = await _externalApiHelper.GetGameMedia(mediaId);
            gameModel!.Reviews.AddRange(await _reviewController.GetMediaReviews(mediaId, 0, 10)); ;

            return gameModel!;
        }

        [HttpGet(Name = "GetEpisode")]
        [Route("[action]/{mediaId}")]
        public async Task<EpisodeModel> GetEpisode(string mediaId)
        {
            // TODO:
            var episodeModel = await _externalApiHelper.GetEpisodeMedia(mediaId);
            return episodeModel!;
        }
    }
}
