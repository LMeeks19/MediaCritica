using MediaCritica.Server.Models;
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
                    .ThenInclude(review => review.User)
                .SingleOrDefaultAsync(movie => movie.Id == movieId);

            return movie;
        }

        public async Task<Game?> GetGameMedia(string gameId)
        {
            var game = await _databaseContext.Games
                .Include(game => game.Ratings)
                .Include(game => game.Reviews)
                    .ThenInclude(review => review.User)
                .SingleOrDefaultAsync(game => game.Id == gameId);

            return game;
        }

        public async Task<Series?> GetSeriesMedia(string seriesId)
        {
            var series = await _databaseContext.Series
                .Include(episdoe => episdoe.Reviews)
                    .ThenInclude(series => series.User)
                .Include(series => series.Ratings)
                .Include(series => series.Seasons)
                    .ThenInclude(season => season.Episodes)
                .SingleOrDefaultAsync(series => series.Id == seriesId);

            return series;
        }

        public async Task<Season?> GetSeasonMedia(string seriesId, int seasonNo)
        {
            var season = await _databaseContext.Seasons
                .Include(s => s.Episodes)
                .SingleOrDefaultAsync(season => season.SeriesId == seriesId && season.SeasonNo == seasonNo);

            return season;
        }

        public async Task<Episode?> GetEpisodeMedia(string episodeId)
        {
            var episode = await _databaseContext.Episodes
                .Include(episode => episode.Ratings)
                .Include(episdoe => episdoe.Reviews)
                    .ThenInclude(review => review.User)
                .Include(episode => episode.Season)
                    .ThenInclude(season => season.Series)
                .AsNoTracking()
                .SingleOrDefaultAsync(episode => episode.Id == episodeId);

            return episode;
        }

        public async Task<PreferenceModel> GetUserPreference(int? userId)
        {
            var user = await _databaseContext.Users
                .Include(user => user.Preference)
                .SingleOrDefaultAsync(user => user.Id == userId);

            return new PreferenceModel
            {
                Timezone = user?.Preference?.Timezone ?? "UTC",
                Locale = user?.Preference?.Locale ?? "en-GB"
            };
        }
    }
}
