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
    public class MediaController(DatabaseContext databaseContext, IMapper mapper, ExternalApiHelper externalApiHelper, InternalApiHelper internalApiHelper, DateRangeCalculatorHelper dateRangeCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly ExternalApiHelper _externalApiHelper = externalApiHelper;
        private readonly InternalApiHelper _internalApiHelper = internalApiHelper;
        private readonly DateRangeCalculatorHelper _dateRangeCalculatorHelper = dateRangeCalculatorHelper;
        private readonly IMapper _mapper = mapper;

        [HttpGet("[action]/{searchTerm}/{page}")]
        public async Task<IActionResult> GetMediaBySearch(string searchTerm, int page)
        {
            var result = await _externalApiHelper.GetSearchMedia(searchTerm, page);
            return Ok(result);
        }

        [HttpGet("[action]/{searchTerm}")]
        public async Task<IActionResult> GetExploreMediaBySearch(string searchTerm)
        {
            var media = await _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Title.StartsWith(searchTerm))
                .OrderBy(m => m.Title)
                .Take(10)
                .ToListAsync();

            return Ok(media.Select(m => _mapper.MediaMapper.MapMediaSummaryModel(m)));
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
            var lastYear = DateTime.Now.Year - 1;

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
            var currentYear = DateTime.Now.Year;

            var query = _databaseContext.Media
                .Where(m => m.Type != MediaType.Episode && m.Released != null && ((DateTime)m.Released!).Year == currentYear && m.Released < DateTime.Now)
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
                .Where(m => m.Type != MediaType.Episode && m.Released < DateTime.Now)
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
                .Where(m => m.Type != MediaType.Episode && m.Released > DateTime.Now)
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
                .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now)
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
            var currentMonth = DateTime.Now.Month;
            var (currentSeasonStartMonth, currentSeasonEndMonth) = _dateRangeCalculatorHelper.GetSeasonMonths(currentMonth);

            var isWinter = currentSeasonStartMonth == 12 && currentSeasonEndMonth == 2;

            var mediaQuery = _databaseContext.Media
                .Where(media => media.Type != MediaType.Episode && media.Released != null)
                .Where(media => (isWinter ?
                    ((DateTime)media.Released!).Month >= currentSeasonStartMonth || ((DateTime)media.Released!).Month <= currentSeasonEndMonth :
                    ((DateTime)media.Released!).Month >= currentSeasonStartMonth && ((DateTime)media.Released!).Month <= currentSeasonEndMonth) &&
                    media.Released <= DateTime.Now)
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
                .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Any())
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
                .Where(media => media.Type != MediaType.Episode && media.Released <= DateTime.Now && media.Reviews.Any())
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
            var movie = await _internalApiHelper.GetMovieMedia(movieId);

            if (movie != null)
                return Ok(_mapper.MovieMapper.MapMovieModel(movie));

            var movieModel = await _externalApiHelper.GetMovieMedia(movieId);
            movie = _mapper.MovieMapper.MapMovie(movieModel);

            await _databaseContext.Movies.AddAsync(movie);
            await _databaseContext.SaveChangesAsync();

            if (movie == null)
                return NotFound(new { Message = "Movie not found" });

            return Ok(_mapper.MovieMapper.MapMovieModel(movie));
        }

        [HttpGet("[action]/{seriesId}")]
        public async Task<IActionResult> GetSeries(string seriesId)
        {
            var series = await _internalApiHelper.GetSeriesMedia(seriesId);

            if (series != null)
                return Ok(_mapper.SeriesMapper.MapSeriesModel(series));

            var seriesModel = await _externalApiHelper.GetSeriesMedia(seriesId);
            series = _mapper.SeriesMapper.MapSeries(seriesModel);

            await _databaseContext.Series.AddAsync(series);
            await _databaseContext.SaveChangesAsync();

            await GetSeason(seriesId);

            if (series == null)
                return NotFound(new { Message = "Series not found" });

            return Ok(_mapper.SeriesMapper.MapSeriesModel(series));
        }

        [HttpGet("[action]/{seriesId}/{seasonNo}")]
        public async Task<IActionResult> GetSeason(string seriesId, int seasonNo = 1)
        {
            var season = await _internalApiHelper.GetSeasonMedia(seriesId, seasonNo);

            if (season != null)
                return Ok(_mapper.SeasonMapper.MapSeasonModel(season));

            var seasonModel = await _externalApiHelper.GetSeasonMedia(seriesId, seasonNo);
            season = _mapper.SeasonMapper.MapSeason(seasonModel!, seriesId);

            await _databaseContext.Seasons.AddAsync(season);
            await _databaseContext.SaveChangesAsync();

            season.Episodes.ForEach(async episode => await GetEpisode(episode.Id));

            if (season == null)
                return NotFound(new { Message = "Season not found" });

            return Ok(_mapper.SeasonMapper.MapSeasonModel(season));
        }

        [HttpGet("[action]/{gameId}")]
        public async Task<IActionResult> GetGame(string gameId)
        {
            var game = await _internalApiHelper.GetGameMedia(gameId);

            if (game != null)
                return Ok(_mapper.GameMapper.MapGameModel(game));

            var gameModel = await _externalApiHelper.GetGameMedia(gameId);
            game = _mapper.GameMapper.MapGame(gameModel);

            await _databaseContext.Games.AddAsync(game);
            await _databaseContext.SaveChangesAsync();

            if (game == null)
                return NotFound(new { Message = "Game not found" });

            return Ok(_mapper.GameMapper.MapGameModel(game));
        }

        [HttpGet("[action]/{episodeId}")]
        public async Task<IActionResult> GetEpisode(string episodeId)
        {
            var episode = await _internalApiHelper.GetEpisodeMedia(episodeId);

            if (episode != null)
                return Ok(_mapper.EpisodeMapper.MapEpisodeModel(episode));

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

            if (episode == null)
                return NotFound(new { Message = "Episode not found" });

            return Ok(_mapper.EpisodeMapper.MapEpisodeModel(episode));
        }
    }
}
