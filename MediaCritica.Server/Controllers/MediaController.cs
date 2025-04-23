using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Objects.Media_Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MediaController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;
        private readonly string _timezone = helper.InternalApiHelper.GetUserTimezone(helper.AuthenticationHelper.GetUserId()).Result;

        [HttpGet("[action]/{searchTerm}/{page}")]
        public async Task<IActionResult> GetMediaByExternalSearch(string searchTerm, int page)
        {
            var result = await _helper.ExternalApiHelper.GetSearchMedia(searchTerm, page);

            if (result?.Search == null || result?.Search.Count == 0 || result == null)
                return NotFound(new { Message = "No results found" });

            return Ok(result);
        }

        [HttpGet("[action]/{searchTerm}")]
        public async Task<IActionResult> GetExploreMediaBySearch(string searchTerm)
        {
            var mediaQuery = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Title.StartsWith(searchTerm))
                .OrderBy(m => m.Title);

            var mediaResopnse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Take(10)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResopnse);

        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetExploreMedia(int offset)
        {
            var mediaQuery = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode)
                .OrderBy(m => m.Title);

            var mediaResopnse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Skip(offset)
                    .Take(50)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResopnse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetBestOfPrevYear(int offset)
        {
            var lastYear = _dateTimeProviderHelper.UtcNow.Year - 1;

            var query = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Released != null && ((DateTime)m.Released!).Year == lastYear)
                .OrderByDescending(m => m.ImdbRating)
                .ThenBy(m => m.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await query
                    .Skip(offset)
                    .Take(10)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await query.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetBestOfCurYear(int offset)
        {
            var currentYear = _dateTimeProviderHelper.UtcNow.Year;

            var query = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Released != null && ((DateTime)m.Released!).Year == currentYear && m.Released < _dateTimeProviderHelper.UtcNow)
                .OrderByDescending(m => m.ImdbRating)
                .ThenBy(m => m.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await query
                    .Skip(offset)
                    .Take(10)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await query.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetBestOfAllTime(int offset)
        {
            var query = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Released < _dateTimeProviderHelper.UtcNow)
                .OrderByDescending(m => m.ImdbRating)
                .ThenBy(m => m.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await query
                    .Skip(offset)
                    .Take(10)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await query.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetUpcoming(int offset)
        {
            var query = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Released > _dateTimeProviderHelper.UtcNow)
                .OrderBy(m => m.Released)
                .ThenBy(m => m.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await query
                    .Skip(offset)
                    .Take(10)
                    .Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m))
                    .ToListAsync(),
                TotalMediaCount = await query.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetLatest(int offset)
        {
            var mediaQuery = _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode && media.Released <= _dateTimeProviderHelper.UtcNow)
                .OrderByDescending(media => media.Released)
                .ThenBy(media => media.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Skip(offset)
                    .Take(10)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetSeasonalPicks(int offset)
        {
            var currentMonth = _dateTimeProviderHelper.UtcNow.Month;
            var (currentSeasonStartMonth, currentSeasonEndMonth) = _helper.DateRangeCalculatorHelper.GetSeasonMonths(currentMonth);

            var isWinter = currentSeasonStartMonth == 12 && currentSeasonEndMonth == 2;

            var mediaQuery = _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode && media.Released != null)
                .Where(media => (isWinter ?
                    ((DateTime)media.Released!).Month >= currentSeasonStartMonth || ((DateTime)media.Released!).Month <= currentSeasonEndMonth :
                    ((DateTime)media.Released!).Month >= currentSeasonStartMonth && ((DateTime)media.Released!).Month <= currentSeasonEndMonth) &&
                    media.Released <= _dateTimeProviderHelper.UtcNow)
                .OrderByDescending(media => media.ImdbRating)
                .ThenBy(media => media.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Skip(offset)
                    .Take(10)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetMostReviewed(int offset)
        {
            var mediaQuery = _databaseContext.Media
                .Include(media => media.Reviews)
                .Where(media => media.Type != MediaType.Episode && media.Released <= _dateTimeProviderHelper.UtcNow && media.Reviews.Any())
                .OrderByDescending(media => media.Reviews.Count)
                .ThenBy(media => media.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Skip(offset)
                    .Take(10)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetRecentlyReviewed(int offset)
        {
            var mediaQuery = _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode && media.Released <= _dateTimeProviderHelper.UtcNow && media.Reviews.Any())
                .OrderByDescending(media => media.Reviews.OrderByDescending(review => review.Date).First().Date)
                .ThenBy(media => media.Title);

            var mediaResponse = new MediaSummaryModelResponse
            {
                MediaSummaryModels = await mediaQuery
                    .Skip(offset)
                    .Take(10)
                    .Select(media => _mapper.MediaMapper.MapMediaSummaryModel(media))
                    .ToListAsync(),
                TotalMediaCount = await mediaQuery.CountAsync()
            };

            return Ok(mediaResponse);
        }

        [HttpGet("[action]/{movieId}")]
        public async Task<IActionResult> GetMovie(string movieId)
        {
            var movie = await _helper.InternalApiHelper.GetMovieMedia(movieId);

            if (movie != null)
                return Ok(_mapper.MovieMapper.MapMovieModel(movie, _timezone, _dateTimeProviderHelper));

            var movieModel = await _helper.ExternalApiHelper.GetMovieMedia(movieId);

            if (movieModel?.Type != MediaType.Movie || movieModel == null)
                return NotFound(new { Message = "Movie not found" });

            movie = _mapper.MovieMapper.MapMovie(movieModel);

            await _databaseContext.Media.AddAsync(movie);
            await _databaseContext.SaveChangesAsync();

            return Ok(_mapper.MovieMapper.MapMovieModel(movie, _timezone, _dateTimeProviderHelper));
        }

        [HttpGet("[action]/{seriesId}")]
        public async Task<IActionResult> GetSeries(string seriesId)
        {
            var series = await _helper.InternalApiHelper.GetSeriesMedia(seriesId);

            if (series != null)
                return Ok(_mapper.SeriesMapper.MapSeriesModel(series, _timezone, _dateTimeProviderHelper));

            var seriesModel = await _helper.ExternalApiHelper.GetSeriesMedia(seriesId);

            if (seriesModel?.Type != MediaType.Series || seriesModel == null)
                return NotFound(new { Message = "Series not found" });

            series = _mapper.SeriesMapper.MapSeries(seriesModel);

            await _databaseContext.Media.AddAsync(series);
            await _databaseContext.SaveChangesAsync();

            await GetSeason(seriesId);

            return Ok(_mapper.SeriesMapper.MapSeriesModel(series, _timezone, _dateTimeProviderHelper));
        }

        [HttpGet("[action]/{seriesId}/{seasonNo}")]
        public async Task<IActionResult> GetSeason(string seriesId, int seasonNo = 1)
        {
            var season = await _helper.InternalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            if (season != null)
                return Ok(_mapper.SeasonMapper.MapSeasonModel(season));

            var seasonModel = await _helper.ExternalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            if (seasonModel == null)
                return NotFound(new { Message = "Season not found" });

            season = _mapper.SeasonMapper.MapSeason(seasonModel!, seriesId);

            await _databaseContext.Seasons.AddAsync(season);
            await _databaseContext.SaveChangesAsync();

            if (seasonModel.Episodes != null)
            {
                foreach (var episode in seasonModel.Episodes)
                {
                    await GetEpisode(episode.imdbID, season.Id);
                }
            }

            return Ok(_mapper.SeasonMapper.MapSeasonModel(season));
        }

        [HttpGet("[action]/{gameId}")]
        public async Task<IActionResult> GetGame(string gameId)
        {
            var game = await _helper.InternalApiHelper.GetGameMedia(gameId);

            if (game != null)
                return Ok(_mapper.GameMapper.MapGameModel(game, _timezone, _dateTimeProviderHelper));

            var gameModel = await _helper.ExternalApiHelper.GetGameMedia(gameId);

            if (gameModel?.Type != MediaType.Game || gameModel == null)
                return NotFound(new { Message = "Game not found" });

            game = _mapper.GameMapper.MapGame(gameModel);

            await _databaseContext.Media.AddAsync(game);
            await _databaseContext.SaveChangesAsync();

            return Ok(_mapper.GameMapper.MapGameModel(game, _timezone, _dateTimeProviderHelper));
        }

        [HttpGet("[action]/{episodeId}")]
        public async Task<IActionResult> GetEpisode(string episodeId, int seasonId = -1)
        {
            var episode = await _helper.InternalApiHelper.GetEpisodeMedia(episodeId);

            if (episode != null && seasonId == -1)
                return Ok(_mapper.EpisodeMapper.MapEpisodeModel(episode, _timezone, _dateTimeProviderHelper));

            var episodeModel = await _helper.ExternalApiHelper.GetEpisodeMedia(episodeId);
            if (seasonId != -1 && episodeModel != null)
                episodeModel.SeasonId = seasonId;

            if (episodeModel?.Type != MediaType.Episode || episodeModel == null)
                return NotFound(new { Message = "Episode not found" });

            episode = _mapper.EpisodeMapper.MapEpisode(episodeModel);

            await _databaseContext.Media.AddAsync(episode);
            await _databaseContext.SaveChangesAsync();

            return Ok(_mapper.EpisodeMapper.MapEpisodeModel(episode, _timezone, _dateTimeProviderHelper));
        }
    }
}
