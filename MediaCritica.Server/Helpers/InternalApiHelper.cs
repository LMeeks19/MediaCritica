using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Helpers
{
    public class InternalApiHelper(DatabaseContext databaseContext)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        public async Task<Movie?> GetMovieMedia(string movieId)
        {
            return await _databaseContext.Movies
                .Include(movie => movie.Ratings)
                .Include(movie => movie.Reviews!)
                    .ThenInclude(review => review.Reviewer)
                .SingleOrDefaultAsync(movie => movie.Id == movieId);
        }

        public async Task<Game?> GetGameMedia(string gameId)
        {
            return await _databaseContext.Games
                .Include(game => game.Ratings)
                .Include(game => game.Reviews!)
                    .ThenInclude(review => review.Reviewer)
                .SingleOrDefaultAsync(game => game.Id == gameId);
        }

        public async Task<Series?> GetSeriesMedia(string seriesId)
        {
            return await _databaseContext.Series
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .Include(series => series.Reviews!)
                    .ThenInclude(review => review.Reviewer)
                .SingleOrDefaultAsync(series => series.Id == seriesId);
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
                .AsNoTracking()
                .SingleOrDefaultAsync(episode => episode.Id == episodeId);
        }
    }
}
