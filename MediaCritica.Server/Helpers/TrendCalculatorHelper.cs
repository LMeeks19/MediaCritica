using MediaCritica.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Helpers
{
    public class TrendCalculatorHelper(DatabaseContext databaseContext)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        public async Task<MediaTrendModel?> GetRisingStar(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PreviousReviews = media.Reviews.Count(r => r.Date >= start.AddDays(-(end - start).Days) && r.Date < start)
                })
                .Where(x => x.RecentReviews > x.PreviousReviews)
                .OrderByDescending(x => x.RecentReviews - x.PreviousReviews)
                .FirstOrDefaultAsync();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Rising Star",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.RecentReviews - trend.PreviousReviews} more reviews than the previous {timeframe}!"
            };
        }
        public async Task<MediaTrendModel?> GetFallingStar(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PreviousReviews = media.Reviews.Count(r => r.Date >= start.AddDays(-(end - start).Days) && r.Date < start)
                })
                .Where(x => x.PreviousReviews > x.RecentReviews)
                .OrderByDescending(x => x.PreviousReviews - x.RecentReviews)
                .FirstOrDefaultAsync();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Falling Star",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.PreviousReviews - trend.RecentReviews} fewer reviews than the previous {timeframe}."
            };
        }

        public async Task<MediaTrendModel?> GetSurprise(DateTime start, DateTime end, string timeframe)
        {
            var timeframeLengthInDays = (end - start).Days;

            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PastReviews = media.Reviews
                        .Where(r => r.Date < start)
                        .ToList(),
                })
                .OrderByDescending(x => x.RecentReviews)
                .FirstOrDefaultAsync();


            if (trend == null) return null;

            var averageReviewsForPreviousTimeframes = trend.PastReviews.Count == 0 ? 0 : trend.PastReviews
                .GroupBy(r => (r.Date - start).Days / timeframeLengthInDays)
                .Average(g => g.Count());

            if (trend.RecentReviews <= averageReviewsForPreviousTimeframes) return null;

            return new MediaTrendModel
            {
                AwardType = "Surprise",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.RecentReviews} reviews this {timeframe}! More than its average of {averageReviewsForPreviousTimeframes} per {timeframe}"
            };
        }

        public async Task<MediaTrendModel?> GetMostReviewed(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end)
                })
                .OrderByDescending(x => x.ReviewCount)
                .FirstOrDefaultAsync();

            if (trend == null || trend.ReviewCount == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Reviewed",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.ReviewCount} reviews this {timeframe}!"
            };
        }

        public async Task<MediaTrendModel?> GetHighestRated(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    AverageRating = media.Reviews
                        .Where(r => r.Date >= start && r.Date <= end)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .OrderByDescending(x => x.AverageRating)
                .FirstOrDefaultAsync();

            if (trend == null || trend.AverageRating < 4.5) return null;

            return new MediaTrendModel
            {
                AwardType = "Highest Rated",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"An outstanding average rating of {trend.AverageRating:F1} this {timeframe}!"
            };
        }

        public async Task<MediaTrendModel?> GetComeback(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PastReviews = media.Reviews.Count(r => r.Date < start.AddDays(-(end - start).Days))
                })
                .Where(x => x.RecentReviews > 0 && x.PastReviews == 0)
                .OrderByDescending(x => x.RecentReviews)
                .FirstOrDefaultAsync();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Comeback",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"A comeback with {trend.RecentReviews} reviews this {timeframe} after a period of inactivity!"
            };
        }

        public async Task<MediaTrendModel?> GetMostActiveGenre(DateTime start, DateTime end, string timeframe)
        {
            var mediaWithReviews = await _databaseContext.Media
                 .Include(media => media.Reviews)
                 .Include(media => media.Backlogs)
                 .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end) || media.Backlogs.Any(r => r.AddedDate >= start && r.AddedDate <= end))
                 .Select(media => new
                 {
                     media.Title,
                     media.Genres,
                     ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                     BacklogCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end)
                 })
                 .ToListAsync();

            var trend = mediaWithReviews
                .SelectMany(media => (media.Genres ?? "").Split(','),
                    (media, genre) => new { Genre = genre.Trim(), media.ReviewCount, media.BacklogCount })
                .GroupBy(x => x.Genre)
                .Select(g => new
                {
                    Genre = g.Key,
                    TotalActivity = g.Sum(x => x.ReviewCount + x.BacklogCount)
                })
                .OrderByDescending(x => x.TotalActivity)
                .FirstOrDefault();


            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Active Genre",
                Timeframe = timeframe,
                Title = trend.Genre,
                Description = $"{trend.Genre} is the most active genre this {timeframe}"
            };
        }

        public async Task<MediaTrendModel?> GetMostBacklogged(DateTime start, DateTime end, string timeframe)
        {
            var trend = await _databaseContext.Media
                .Include(media => media.Backlogs)
                .Select(media => new
                {
                    media.Title,
                    BacklogCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end)
                })
                .OrderByDescending(x => x.BacklogCount)
                .FirstOrDefaultAsync();

            if (trend == null || trend.BacklogCount == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Backlogged",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"Added to backlogs 1 time(s) this week!"
            };
        }
    }
}
