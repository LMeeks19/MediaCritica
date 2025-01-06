using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Helpers
{
    public class MilestoneCalculatorHelper(DatabaseContext databaseContext, DateRangeCalculatorHelper dateRangeCalculatorHelper)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly DateRangeCalculatorHelper _dateRangeCalculatorHelper = dateRangeCalculatorHelper;

        public async Task UpdateUserMilestones(User user)
        {

            if (user != null)
            {
                var genreCounts = user.Reviews
                    .SelectMany(review => (review.Media.Genres ?? "").Split(","),
                        (review, genre) => new { Genre = genre.Trim() })
                    .GroupBy(x => x.Genre)
                    .Select(g => new
                    {
                        Genre = g.Key,
                        Count = g.Count()
                    })
                    .ToList();

                var uniqueGenresReviewed = genreCounts.Count;

                var consecutiveDaysActive = CalculateConsecutiveActivity(user.Reviews);
                var monthRange = _dateRangeCalculatorHelper.GetThisMonthRange();
                var yearRange = _dateRangeCalculatorHelper.GetThisYearRange();

                await UpdateMilestone(user, MilestoneType.ReviewsWritten, user.Reviews.Count);
                await UpdateMilestone(user, MilestoneType.MoviesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Movie));
                await UpdateMilestone(user, MilestoneType.GamesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Game));
                await UpdateMilestone(user, MilestoneType.SeriesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Series));
                await UpdateMilestone(user, MilestoneType.SingleGenreReviewed, genreCounts.Count == 0 ? 0 : genreCounts.Max(g => g.Count));
                await UpdateMilestone(user, MilestoneType.GenreVariety, uniqueGenresReviewed);
                await UpdateMilestone(user, MilestoneType.MonthlyReviews, user.Reviews.Count(r => r.Date >= monthRange.start && r.Date <= monthRange.end));
                await UpdateMilestone(user, MilestoneType.YearlyReviews, user.Reviews.Count(r => r.Date >= yearRange.start && r.Date <= yearRange.end));
                await UpdateMilestone(user, MilestoneType.ConsecutiveActivity, consecutiveDaysActive);
            }
        }

        private async Task UpdateMilestone(User user, MilestoneType type, int currentCount)
        {
            var thresholds = GetThresholds(type);

            // Determine current level and next level
            var earnedLevel = thresholds
                .Where(t => currentCount >= t.Value)
                .Select(t => t.Key)
                .DefaultIfEmpty(MilestoneLevel.None)
                .Max();

            // Fetch existing milestone
            var milestone = user.Milestones
                .FirstOrDefault(a => a.MilestoneType == type);

            if (milestone == null)
            {
                // Create new milestone if it doesn't exist
                milestone = new Milestone
                {
                    UserId = user.Id,
                    MilestoneType = type,
                    EarnedLevel = earnedLevel,
                    EarnedDate = earnedLevel != MilestoneLevel.None ? DateTime.UtcNow : null,
                };

                await _databaseContext.Milestones.AddAsync(milestone);
            }
            else
            {
                // Update existing milestone
                milestone.EarnedLevel = earnedLevel > milestone.EarnedLevel ? earnedLevel : milestone.EarnedLevel;
                milestone.EarnedDate = earnedLevel != MilestoneLevel.None ? DateTime.Now : milestone.EarnedDate;
            }

            _databaseContext.SaveChanges();
        }

        public List<MilestoneModel> GetUserMilestones(User user)
        {

            // Calculate genre variety and consecutive activity
            var genreCounts = user.Reviews
                .SelectMany(review => (review.Media.Genres ?? "").Split(","),
                    (review, genre) => new { Genre = genre.Trim() })
                .GroupBy(x => x.Genre)
                .Select(g => new
                {
                    Genre = g.Key,
                    Count = g.Count()
                })
                .ToList();

            var uniqueGenresReviewed = genreCounts.Count;

            var consecutiveDaysActive = CalculateConsecutiveActivity(user.Reviews);
            var monthRange = _dateRangeCalculatorHelper.GetThisMonthRange();
            var yearRange = _dateRangeCalculatorHelper.GetThisYearRange();

            // Fetch earned milestones

            // Define dynamic milestone types and data
            var milestonesData = new List<(MilestoneType Type, int Count)>
        {
            (MilestoneType.ReviewsWritten, user.Reviews.Count),
            (MilestoneType.MoviesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Movie)),
            (MilestoneType.GamesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Game)),
            (MilestoneType.SeriesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Series)),
            (MilestoneType.BacklogAdded, user.Backlogs.Count),
            (MilestoneType.FinishedMedia, user.Backlogs.Count(b => b.Category == BacklogCategoryType.Finished)),
            (MilestoneType.SingleGenreReviewed, genreCounts.Count == 0 ? 0 : genreCounts.Max(g => g.Count)),
            (MilestoneType.GenreVariety, uniqueGenresReviewed),
            (MilestoneType.MonthlyReviews, user.Reviews.Count(r => r.Date >= monthRange.start && r.Date <= monthRange.end)),
            (MilestoneType.YearlyReviews, user.Reviews.Count(r => r.Date >= yearRange.start && r.Date <= yearRange.end)),
            (MilestoneType.ConsecutiveActivity, consecutiveDaysActive)
        };

            // Calculate progress for each milestone
            var progress = milestonesData
                .Select(data => CalculateMilestone(user.Milestones, data.Type, data.Count))
                .ToList();

            return progress;
        }

        private static int CalculateConsecutiveActivity(List<Review> reviews)
        {
            // Group reviews by day and count consecutive days
            var reviewDates = reviews.Select(r => r.Date.Date).Distinct().OrderBy(d => d).ToList();
            int maxConsecutiveDays = 0, currentStreak = 0;

            for (int i = 0; i < reviewDates.Count; i++)
            {
                if (i == 0 || reviewDates[i] == reviewDates[i - 1].AddDays(1))
                {
                    currentStreak++;
                    maxConsecutiveDays = Math.Max(maxConsecutiveDays, currentStreak);
                }
                else
                {
                    currentStreak = 1;
                }
            }

            return maxConsecutiveDays;
        }

        private static Dictionary<MilestoneLevel, int> GetThresholds(MilestoneType type)
        {
            return type switch
            {
                MilestoneType.SingleGenreReviewed
                or MilestoneType.GenreVariety
                or MilestoneType.MonthlyReviews =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 1 },
                        { MilestoneLevel.Silver, 5 },
                        { MilestoneLevel.Gold, 10 },
                        { MilestoneLevel.Platinum, 20 }
                    },
                MilestoneType.ConsecutiveActivity =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 7 },
                        { MilestoneLevel.Silver, 30 },
                        { MilestoneLevel.Gold, 90 },
                        { MilestoneLevel.Platinum, 365 }
                    },
                MilestoneType.ReviewsWritten =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 50 },
                        { MilestoneLevel.Silver, 100 },
                        { MilestoneLevel.Gold, 150 },
                        { MilestoneLevel.Platinum, 200 }
                    },
                _ =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 25 },
                        { MilestoneLevel.Silver, 50 },
                        { MilestoneLevel.Gold, 75 },
                        { MilestoneLevel.Platinum, 100 }
                    }
            };
        }

        private static MilestoneModel CalculateMilestone(
            ICollection<Milestone> earnedmilestones,
            MilestoneType type,
            int currentCount)
        {
            // Define thresholds
            var thresholds = GetThresholds(type);

            // Find the highest earned level
            var earnedmilestone = earnedmilestones
                .FirstOrDefault(a => a.MilestoneType == type);
            var earnedLevel = earnedmilestone?.EarnedLevel ?? MilestoneLevel.None;

            // Determine current progress and next level
            var nextLevel = thresholds.FirstOrDefault(t => t.Key == earnedLevel + 1).Key;
            var progressPercent = Math.Round(nextLevel != MilestoneLevel.None
                ? (double)currentCount / thresholds[nextLevel] * 100
                : 100);

            return new MilestoneModel
            {
                Title = GetTitle(type),
                Description = GetDescription(type),
                Category = GetCategory(type),
                EarnedLevel = earnedLevel,
                Progress = new ProgressModel()
                {
                    Current = currentCount,
                    Target = thresholds[nextLevel],
                    Percentage = progressPercent,
                },
                EarnedDate = earnedmilestone?.EarnedDate
            };
        }

        private static string GetTitle(MilestoneType type)
        {
            return type switch
            {
                MilestoneType.ReviewsWritten => "Reviews Written",
                MilestoneType.MoviesReviewed => "Movies Reviews",
                MilestoneType.GamesReviewed => "Games Reviews",
                MilestoneType.SeriesReviewed => "Series Reviews",
                MilestoneType.BacklogAdded => "Backlogged Media",
                MilestoneType.FinishedMedia => "Finished Media",
                MilestoneType.SingleGenreReviewed => "Single Genre",
                MilestoneType.GenreVariety => "Unique Genres",
                MilestoneType.MonthlyReviews => "Monthly Reviews",
                MilestoneType.YearlyReviews => "Yearly Reviews",
                MilestoneType.ConsecutiveActivity => "Activity Streak",
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unhandled type: {type}")
            };
        }

        private static string GetDescription(MilestoneType type)
        {
            return type switch
            {
                MilestoneType.ReviewsWritten => "Reviews written for media",
                MilestoneType.MoviesReviewed => "Review movies to share your thoughts",
                MilestoneType.GamesReviewed => "Critique games to provie feedback",
                MilestoneType.SeriesReviewed => "Share your thoughts on series",
                MilestoneType.BacklogAdded => "Keep track of media you'd like to watch or play",
                MilestoneType.FinishedMedia => "Complete watching or playing a pieces of media",
                MilestoneType.SingleGenreReviewed => "Focus on reviewing a single genre of media",
                MilestoneType.GenreVariety => "Review media across multiple genres",
                MilestoneType.MonthlyReviews => "Contribute reviews in a month",
                MilestoneType.YearlyReviews => "Contribute reviews in a year",
                MilestoneType.ConsecutiveActivity => "Stay active for consecutive days",
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unhandled type: {type}")
            };
        }

        private static MilestoneCategory GetCategory(MilestoneType type)
        {
            return type switch
            {
                MilestoneType.ReviewsWritten => MilestoneCategory.Reviews,
                MilestoneType.MoviesReviewed => MilestoneCategory.Reviews,
                MilestoneType.GamesReviewed => MilestoneCategory.Reviews,
                MilestoneType.SeriesReviewed => MilestoneCategory.Reviews,
                MilestoneType.BacklogAdded => MilestoneCategory.Interaction,
                MilestoneType.FinishedMedia => MilestoneCategory.Interaction,
                MilestoneType.SingleGenreReviewed => MilestoneCategory.Variety,
                MilestoneType.GenreVariety => MilestoneCategory.Variety,
                MilestoneType.MonthlyReviews => MilestoneCategory.Activity,
                MilestoneType.YearlyReviews => MilestoneCategory.Activity,
                MilestoneType.ConsecutiveActivity => MilestoneCategory.Activity,
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unhandled type: {type}")
            };
        }
    }
}
