using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Models.Media_Models;
using MediaCritica.Server.Objects.Media_Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MediaController(DatabaseContext databaseContext, IMapper mapper, ExternalApiHelper externalApiHelper, InternalApiHelper internalApiHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly ExternalApiHelper _externalApiHelper = externalApiHelper;
        private readonly InternalApiHelper _internalApiHelper = internalApiHelper;
        private readonly IMapper _mapper = mapper;

        [HttpGet(Name = "GetMediaBySearch")]
        [Route("[action]/{searchTerm}/{page}")]
        public async Task<MediaSearchResultResponse> GetMediaBySearch(string searchTerm, int page)
        {
            return await _externalApiHelper.GetSearchMedia(searchTerm, page);
        }

        [HttpGet(Name = "GetExploreMediaBySearch")]
        [Route("[action]/{searchTerm}")]
        public async Task<List<MediaSummaryModel>> GetExploreMediaBySearch(string searchTerm)
        {
            return await _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode && media.Title.StartsWith(searchTerm))
                .OrderBy(media => media.Title)
                .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                .Take(10)
                .ToListAsync();
        }

        [HttpGet(Name = "GetExploreMedia")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetExploreMedia(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode)
                    .OrderBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(100)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetBestOfPrevYear")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetBestOfPrevYear(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released.Year == DateTime.Now.Year - 1)
                    .OrderByDescending(media => media.ImdbRating)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released.Year == DateTime.Now.Year - 1)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetBestOfCurYear")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetBestOfCurYear(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released.Year == DateTime.Now.Year && media.Released < DateTime.Now)
                    .OrderByDescending(media => media.ImdbRating)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released.Year == DateTime.Now.Year && media.Released < DateTime.Now)
                    .CountAsync()
            };

            return mediaResponse;
        }


        [HttpGet(Name = "GetBestOfAllTime")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetBestOfAllTime(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released < DateTime.Now)
                    .OrderByDescending(media => media.ImdbRating)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released < DateTime.Now)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetUpcoming")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetUpcoming(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released > DateTime.Now)
                    .OrderBy(media => media.Released)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released > DateTime.Now)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetLatest")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetLatest(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now)
                    .OrderByDescending(media => media.Released)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetSeasonalPicks")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetSeasonalPicks(int offset)
        {
            var currentSeasonStartMonth = 0;
            var currentSeasonEndMonth = 0;

            switch (DateTime.Now.Month)
            {
                case >= 12:
                case <= 2:
                    currentSeasonStartMonth = 12;
                    currentSeasonEndMonth = 2;
                    break;
                case >= 3 and <= 5:
                    currentSeasonStartMonth = 3;
                    currentSeasonEndMonth = 5;
                    break;
                case >= 6 and <= 8:
                    currentSeasonStartMonth = 6;
                    currentSeasonEndMonth = 8;
                    break;
                default:
                    currentSeasonStartMonth = 9;
                    currentSeasonEndMonth = 11;
                    break;
            }

            var isWinter = currentSeasonStartMonth == 12 && currentSeasonEndMonth == 2;

            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode)
                    .Where(media => (isWinter ? (media.Released.Month >= currentSeasonStartMonth || media.Released.Month <= currentSeasonEndMonth) : (media.Released.Month >= currentSeasonStartMonth && media.Released.Month <= currentSeasonEndMonth)) && media.Released <= DateTime.Now)
                    .OrderByDescending(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode)
                    .Where(media => (isWinter ? (media.Released.Month >= currentSeasonStartMonth || media.Released.Month <= currentSeasonEndMonth) : (media.Released.Month >= currentSeasonStartMonth && media.Released.Month <= currentSeasonEndMonth)) && media.Released <= DateTime.Now)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetMostReviewed")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetMostReviewed(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Include(media => media.Reviews)
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Count != 0)
                    .OrderByDescending(media => media.Reviews.Count)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Count != 0)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetRecentlyReviewed")]
        [Route("[action]/{offset}")]
        public async Task<MediaSummaryModelResponse> GetRecentlyReviewed(int offset)
        {
            var mediaResponse = new MediaSummaryModelResponse()
            {
                MediaSummaryModels = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Count != 0)
                    .OrderByDescending(media => media.Reviews.Select(review => review).OrderByDescending(review => review.Date).First().Date)
                    .ThenBy(media => media.Title)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .Skip(offset)
                    .Take(10)
                    .ToListAsync(),
                TotalMediaCount = await _databaseContext.Media
                    .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Count != 0)
                    .CountAsync()
            };

            return mediaResponse;
        }

        [HttpGet(Name = "GetMovie")]
        [Route("[action]/{movieId}")]
        public async Task<MovieModel> GetMovie(string movieId)
        {
            var movie = await _internalApiHelper.GetMovieMedia(movieId);

            if (movie != null)
                return _mapper.MovieMapper.MapMovieModel(movie);

            var movieModel = await _externalApiHelper.GetMovieMedia(movieId);

            movie = _mapper.MovieMapper.MapMovie(movieModel);

            await _databaseContext.Movies.AddAsync(movie);
            await _databaseContext.SaveChangesAsync();

            movie = await _internalApiHelper.GetMovieMedia(movieId);

            return _mapper.MovieMapper.MapMovieModel(movie!);
        }

        [HttpGet(Name = "GetSeries")]
        [Route("[action]/{seriesId}")]
        public async Task<SeriesModel> GetSeries(string seriesId)
        {
            var series = await _internalApiHelper.GetSeriesMedia(seriesId);

            if (series != null)
                return _mapper.SeriesMapper.MapSeriesModel(series);


            var seriesModel = await _externalApiHelper.GetSeriesMedia(seriesId);

            series = _mapper.SeriesMapper.MapSeries(seriesModel);

            await _databaseContext.Series.AddAsync(series);
            await _databaseContext.SaveChangesAsync();

            await GetSeason(seriesId);

            series = await _internalApiHelper.GetSeriesMedia(seriesId);

            return _mapper.SeriesMapper.MapSeriesModel(series!);
        }

        [HttpGet(Name = "GetSeason")]
        [Route("[action]/{seriesId}/{seasonNo}")]
        public async Task<SeasonModel> GetSeason(string seriesId, int seasonNo = 1)
        {
            var season = await _internalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            if (season != null)
                return _mapper.SeasonMapper.MapSeasonModel(season);

            var seasonModel = await _externalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            season = _mapper.SeasonMapper.MapSeason(seasonModel!, seriesId);

            await _databaseContext.Seasons.AddAsync(season);
            await _databaseContext.SaveChangesAsync();

            season = await _internalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            return _mapper.SeasonMapper.MapSeasonModel(season!);
        }

        [HttpGet(Name = "GetGame")]
        [Route("[action]/{gameId}")]
        public async Task<GameModel> GetGame(string gameId)
        {
            var game = await _internalApiHelper.GetGameMedia(gameId);

            if (game != null)
                return _mapper.GameMapper.MapGameModel(game);

            var gameModel = await _externalApiHelper.GetGameMedia(gameId);

            game = _mapper.GameMapper.MapGame(gameModel);

            await _databaseContext.Games.AddAsync(game);
            await _databaseContext.SaveChangesAsync();

            game = await _internalApiHelper.GetGameMedia(gameId);

            return _mapper.GameMapper.MapGameModel(game!);
        }

        [HttpGet(Name = "GetEpisode")]
        [Route("[action]/{episodeId}")]
        public async Task<EpisodeModel> GetEpisode(string episodeId)
        {
            var episode = await _internalApiHelper.GetEpisodeMedia(episodeId);

            if (episode != null && episode.IsFullyPopulated)
                return _mapper.EpisodeMapper.MapEpisodeModel(episode);

            var episodeModel = await _externalApiHelper.GetEpisodeMedia(episodeId);

            if (episode != null)
            {
                episodeModel.Id = episode.Id;
                episodeModel.SeasonId = episode.SeasonId;
            }

            episode = _mapper.EpisodeMapper.MapEpisode(episodeModel);

            if (episode.Id == null)
                await _databaseContext.Episodes.AddAsync(episode);
            else
                _databaseContext.Episodes.Update(episode);

            await _databaseContext.SaveChangesAsync();

            episode = await _internalApiHelper.GetEpisodeMedia(episodeId);

            return _mapper.EpisodeMapper.MapEpisodeModel(episode!);
        }
    }
}
