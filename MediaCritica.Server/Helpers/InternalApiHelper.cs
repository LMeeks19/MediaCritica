using MediaCritica.Server.Enums;
using MediaCritica.Server.Objects;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Helpers
{
    public class InternalApiHelper(DatabaseContext databaseContext)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        public async Task<Movie?> GetMovieMedia(string movieId)
        {
            var movie = await _databaseContext.Movies
                .Include(movie => movie.Ratings)
                .Include(movie => movie.Reviews)
                .SingleOrDefaultAsync(movie => movie.Id == movieId && movie.Type == MediaType.Movie);

            return movie;
        }

        public async Task<Game?> GetGameMedia(string gameId)
        {
            var game = await _databaseContext.Games
                .Include(game => game.Ratings)
                .Include(game => game.Reviews)
                .SingleOrDefaultAsync(game => game.Id == gameId && game.Type == MediaType.Game);

            return game;
        }

        public async Task<Series?> GetSeriesMedia(string seriesId)
        {
            var series = await _databaseContext.Series
                .Include(episdoe => episdoe.Reviews)
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .SingleOrDefaultAsync(series => series.Id == seriesId && series.Type == MediaType.Series);

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
                .SingleOrDefaultAsync(episode => episode.Id == episodeId && episode.Type == MediaType.Episode);
        }
    }
}
