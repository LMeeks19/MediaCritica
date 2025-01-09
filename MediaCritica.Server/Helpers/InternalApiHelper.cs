using MediaCritica.Server.Controllers;
using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Helpers
{
    public class InternalApiHelper(DatabaseContext databaseContext, ReviewController reviewController)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly ReviewController _reviewController = reviewController;

        public async Task<Movie?> GetMovieMedia(string movieId)
        {
            var movie = await _databaseContext.Movies
                .Include(movie => movie.Ratings)
                .Include(movie => movie.Reviews)
                .SingleOrDefaultAsync(movie => movie.Id == movieId);

            if (movie != null)
                movie.Reviews = await _databaseContext.Reviews
                .Where(review => review.MediaId == movieId)
                .OrderByDescending(review => review.Date)
                .Select(review => review)
                .Take(10)
                .ToListAsync();

            return movie;
        }

        public async Task<Game?> GetGameMedia(string gameId)
        {
            var game = await _databaseContext.Games
                .Include(game => game.Ratings)
                .Include(game => game.Reviews)
                .SingleOrDefaultAsync(game => game.Id == gameId);

            if (game != null)
                game.Reviews = await _databaseContext.Reviews
                .Where(review => review.MediaId == gameId)
                .OrderByDescending(review => review.Date)
                .Select(review => review)
                .Take(10)
                .ToListAsync();

            return game;
        }

        public async Task<Series?> GetSeriesMedia(string seriesId)
        {
            var series = await _databaseContext.Series
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .SingleOrDefaultAsync(series => series.Id == seriesId);

            if (series != null)
                series.Reviews = await _databaseContext.Reviews
                .Where(review => review.MediaId == seriesId)
                .OrderByDescending(review => review.Date)
                .Select(review => review)
                .Take(10)
                .ToListAsync();

            return series;
        }

        public async Task<Season?> GetSeasonMedia(string seriesId, int seasonNo)
        {
            return await _databaseContext.Seasons
                .Include(s => s.Episodes)
                .SingleOrDefaultAsync(season => season.SeriesId == seriesId && season.SeasonNo == seasonNo);
        }

        public async Task<Episode?> GetEpisodeMedia(string episodeId)
        {
            return await _databaseContext.Episodes
                .Include(episode => episode.Ratings)
                .Include(episdoe => episdoe.Reviews)
                .Include(episode => episode.Season)
                    .ThenInclude(season => season.Series)
                .AsNoTracking()
                .SingleOrDefaultAsync(episode => episode.Id == episodeId);
        }
    }
}
