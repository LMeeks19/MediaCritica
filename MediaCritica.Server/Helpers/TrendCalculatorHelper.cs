using MediaCritica.Server.Enums;
using MediaCritica.Server.Extensions;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Helpers
{
    public class TrendCalculatorHelper()
    {

        public MediaTrendModel? GetRisingStar(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PreviousReviews = media.Reviews.Count(r => r.Date >= start.AddDays(-(end - start).Days) && r.Date < start)
                })
                .Where(x => x.RecentReviews > x.PreviousReviews)
                .OrderByDescending(x => x.RecentReviews - x.PreviousReviews)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Rising Star",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.RecentReviews - trend.PreviousReviews} more reviews than the previous {timeframe}!"
            };
        }
        public MediaTrendModel? GetFallingStar(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PreviousReviews = media.Reviews.Count(r => r.Date >= start.AddDays(-(end - start).Days) && r.Date < start)
                })
                .Where(x => x.PreviousReviews > x.RecentReviews)
                .OrderByDescending(x => x.PreviousReviews - x.RecentReviews)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Falling Star",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.PreviousReviews - trend.RecentReviews} fewer reviews than the previous {timeframe}."
            };
        }

        public MediaTrendModel? GetSurprise(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var timeframeLengthInDays = (end - start).Days;

            var trend = media
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PastReviews = media.Reviews
                        .Where(r => r.Date < start)
                        .ToList(),
                })
                .OrderByDescending(x => x.RecentReviews)
                .FirstOrDefault();

            if (trend == null) return null;

            var averageReviewsForPreviousTimeframes = trend.PastReviews.Count == 0 ? 0 : trend.PastReviews
                .GroupBy(r => (r.Date - start).Days / timeframeLengthInDays)
                .Average(g => g.Count());

            if (trend.RecentReviews <= averageReviewsForPreviousTimeframes) return null;

            return new MediaTrendModel
            {
                AwardType = "Sleeper Hit",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.RecentReviews} reviews this {timeframe}! More than its average of {averageReviewsForPreviousTimeframes} per {timeframe}"
            };
        }

        public MediaTrendModel? GetMostReviewed(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end)
                })
                .OrderByDescending(x => x.ReviewCount)
                .FirstOrDefault();

            if (trend == null || trend.ReviewCount == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Reviewed",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.ReviewCount} reviews this {timeframe}!"
            };
        }

        public MediaTrendModel? GetHighestRated(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    AverageRating = media.Reviews
                        .Where(r => r.Date >= start && r.Date <= end)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .OrderByDescending(x => x.AverageRating)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Highest Rated",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"An outstanding average rating of {trend.AverageRating:F1} this {timeframe}!"
            };
        }

        public MediaTrendModel? GetComeback(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    RecentReviews = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    PastReviews = media.Reviews.Count(r => r.Date < start.AddDays(-(end - start).Days))
                })
                .Where(x => x.RecentReviews > 0 && x.PastReviews == 0)
                .OrderByDescending(x => x.RecentReviews)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Comeback",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"A comeback with {trend.RecentReviews} reviews this {timeframe} after a period of inactivity!"
            };
        }

        public MediaTrendModel? GetMostActiveGenre(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var mediaWithReviews = media
                 .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end) || media.Backlogs.Any(r => r.AddedDate >= start && r.AddedDate <= end))
                 .Where(media => media.Genres != "N/A" || media.Genres != null)
                 .Select(media => new
                 {
                     media.Title,
                     media.Genres,
                     ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                     BacklogCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end)
                 })
                 .ToList();

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
                Description = $"{trend.Genre} is the most active genre this {timeframe}!"
            };
        }

        public MediaTrendModel? GetMostBacklogged(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Select(media => new
                {
                    media.Title,
                    BacklogCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end)
                })
                .OrderByDescending(x => x.BacklogCount)
                .FirstOrDefault();

            if (trend == null || trend.BacklogCount == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Backlogged",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"Added to backlogs {trend.BacklogCount} time{(trend.BacklogCount > 1 ? "s" : "")} this {timeframe}!"
            };
        }

        public MediaTrendModel? GetMostUnfinished(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Where(media => media.Backlogs.Any(b => b.AddedDate >= start && b.AddedDate <= end))
                .Select(media => new
                {
                    media.Title,
                    StartedCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end && b.Category != BacklogCategoryType.Backlog),
                    FinishedCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end && b.Category == BacklogCategoryType.Finished),
                })
                .OrderByDescending(x => x.StartedCount - x.FinishedCount)
                .FirstOrDefault();

            if (trend == null || (trend.StartedCount - trend.FinishedCount) == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Unfinished",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.StartedCount - trend.FinishedCount} user{(trend.StartedCount - trend.FinishedCount > 1 ? "s " : "")} didn't complete it this {timeframe}!"
            };
        }

        public MediaTrendModel? GetMostAbandoned(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Where(media => media.Backlogs.Any(b => b.AddedDate >= start && b.AddedDate <= end))
                .Select(media => new
                {
                    media.Title,
                    AbandonedCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end && b.Category != BacklogCategoryType.Finished),
                    FinishedCount = media.Backlogs.Count(b => b.AddedDate >= start && b.AddedDate <= end && b.Category == BacklogCategoryType.Finished),
                })
                .OrderByDescending(x => x.AbandonedCount - x.FinishedCount)
                .FirstOrDefault();

            if (trend == null || (trend.AbandonedCount - trend.FinishedCount) == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Abandoned",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.AbandonedCount - trend.FinishedCount} user{(trend.AbandonedCount - trend.FinishedCount > 1 ? "s" : "")} either abandoned it early or never started it this {timeframe}!"
            };
        }

        public MediaTrendModel? GetHiddenGem(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var reviews = media
                .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end))
                .Select(media => media.Reviews.Count(r => r.Date >= start && r.Date <= end))
                .ToList();

            var averageReviewCount = reviews.Count == 0 ? 0 : reviews.Average();

            var trend = media
                .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end))
                .Select(media => new
                {
                    media.Title,
                    ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                    AverageRating = media.Reviews
                        .Where(r => r.Date >= start && r.Date <= end)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .Where(x => x.ReviewCount < averageReviewCount && x.AverageRating >= 4.5)
                .OrderByDescending(x => x.AverageRating)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Hidden Gem",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.ReviewCount} reviews with an average rating of {trend.AverageRating:F1}!"
            };
        }

        public MediaTrendModel? GetDirectorsSpotlight(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var mediaWithReviews = media
                 .Where(media => media.Directors != "N/A" && media.Directors != null)
                 .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end) || media.Backlogs.Any(r => r.AddedDate >= start && r.AddedDate <= end))
                 .Select(media => new
                 {
                     media.Title,
                     media.Directors,
                     ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                     AverageRating = media.Reviews
                        .Where(r => r.Date >= start && r.Date <= end)
                        .Average(r => (double?)r.Rating) ?? 0
                 })
                 .ToList();

            var trend = mediaWithReviews
                .SelectMany(media => (media.Directors ?? "").Split(','),
                    (media, director) => new { Director = director.Trim(), media.ReviewCount, media.AverageRating })
                .GroupBy(x => x.Director)
                .Select(g => new
                {
                    Director = g.Key,
                    TotalReviews = g.Sum(x => x.ReviewCount),
                    AverageRating = g.Average(x => x.AverageRating)
                })
                .Where(x => x.TotalReviews > 0 && x.AverageRating >= 4.0)
                .OrderByDescending(x => x.TotalReviews)
                .ThenByDescending(x => x.AverageRating)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Director Spotlight",
                Timeframe = timeframe,
                Title = trend.Director,
                Description = $"{trend.TotalReviews} reviews on their media with an average rating of {trend.AverageRating:F1}!"
            };
        }

        public MediaTrendModel? GetActorsSpotlight(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var mediaWithReviews = media
                 .Where(media => media.Actors != "N/A" && media.Actors != null)
                 .Where(media => media.Reviews.Any(r => r.Date >= start && r.Date <= end) || media.Backlogs.Any(r => r.AddedDate >= start && r.AddedDate <= end))
                 .Select(media => new
                 {
                     media.Title,
                     media.Actors,
                     ReviewCount = media.Reviews.Count(r => r.Date >= start && r.Date <= end),
                     AverageRating = media.Reviews
                        .Where(r => r.Date >= start && r.Date <= end)
                        .Average(r => (double?)r.Rating) ?? 0
                 })
                 .ToList();

            var trend = mediaWithReviews
                .SelectMany(media => (media.Actors ?? "").Split(','),
                    (media, actor) => new { Actor = actor.Trim(), media.ReviewCount, media.AverageRating })
                .GroupBy(x => x.Actor)
                .Select(g => new
                {
                    Actor = g.Key,
                    TotalReviews = g.Sum(x => x.ReviewCount),
                    AverageRating = g.Average(x => x.AverageRating)
                })
                .Where(x => x.TotalReviews > 0 && x.AverageRating >= 4.0)
                .OrderByDescending(x => x.TotalReviews)
                .ThenByDescending(x => x.AverageRating)
                .FirstOrDefault();

            if (trend == null) return null;

            return new MediaTrendModel
            {
                AwardType = "Actor Spotlight",
                Timeframe = timeframe,
                Title = trend.Actor,
                Description = $"{trend.TotalReviews} reviews on their media with an average rating of {trend.AverageRating:F1}!"
            };
        }

        public MediaTrendModel? GetMostAnticipated(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            var trend = media
                .Where(media => media.Released > start && media.Released <= end)
                .Select(media => new
                {
                    media.Title,
                    media.Released,
                    BacklogCount = media.Backlogs.Where(b => b.AddedDate >= start && b.AddedDate <= end).Count()
                })
                .OrderByDescending(x => x.BacklogCount)
                .FirstOrDefault();

            if (trend == null || trend.BacklogCount == 0) return null;

            return new MediaTrendModel
            {
                AwardType = "Most Anticipated",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"Added to user backlogs {trend.BacklogCount} time{(trend.BacklogCount > 1 ? "s" : "")} ahead of its release on {(trend.Released == null ? "unknown" : trend.Released?.GetDateByTimeFrame(timeframe))} this {timeframe}!"
            };
        }

        public MediaTrendModel? GetMostPolarising(List<Media> media, DateTime start, DateTime end, string timeframe)
        {
            // Fetch media with ratings within the specified date range
            var mediaWithReviews = media
                .Where(m => m.Reviews.Any(r => r.Date >= start && r.Date <= end))
                .Select(m => new
                {
                    m.Title,
                    Ratings = m.Reviews.Where(r => r.Date >= start && r.Date <= end).Select(r => r.Rating).ToList()
                })
                .ToList();

            // Calculate the standard deviation of ratings for each media
            var trend = mediaWithReviews
                .Select(m => new
                {
                    m.Title,
                    StandardDeviation = m.Ratings.CalculateStandardDeviation()
                })
                .OrderByDescending(m => m.StandardDeviation)
                .FirstOrDefault();

            if (trend == null || trend.StandardDeviation == 0)
                return null; // No media with significant polarization

            // Return the trend result
            return new MediaTrendModel
            {
                AwardType = "Most Polarizing",
                Timeframe = timeframe,
                Title = trend.Title,
                Description = $"{trend.Title} sparked a lot of debate this {timeframe}, with a variability score of {trend.StandardDeviation:F2}!"
            };
        }
    }
}
