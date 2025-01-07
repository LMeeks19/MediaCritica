using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Helpers
{
    public class MilestoneCalculatorHelper(DatabaseContext databaseContext, DateRangeCalculatorHelper dateRangeCalculatorHelper)
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly DateRangeCalculatorHelper _dateRangeCalculatorHelper = dateRangeCalculatorHelper;

        public List<Milestone> CreateMilestones()
        {
            var milestones = new List<Milestone>();

            foreach (var value in Enum.GetValues(typeof(MilestoneType)))
            {
                milestones.Add(CreateMilestone((MilestoneType)value));
            }

            return milestones;
        }

        public Milestone CreateMilestone(MilestoneType type)
        {
            return new Milestone()
            {
                MilestoneType = type,
                EarnedLevel = MilestoneLevel.None,
                EarnedDate = null
            };
        }

        public async Task UpdateUserReviewMilestones(User user)
        {

            if (user != null)
            {
                var genres = user.Reviews
                    .SelectMany(review => (review.Media.Genres ?? "").Split(","),
                        (review, genre) => new { Genre = genre.Trim() })
                    .GroupBy(x => x.Genre)
                    .Select(g => new
                    {
                        Genre = g.Key,
                        Count = g.Count()
                    })
                    .ToList();

                var uniqueGenresReviewed = genres.Count;

                var actors = user.Reviews
                    .SelectMany(review => (review.Media.Actors ?? "").Split(","),
                        (review, actor) => new { Actor = actor.Trim() })
                    .GroupBy(x => x.Actor)
                    .Select(g => new
                    {
                        Genre = g.Key,
                        Count = g.Count()
                    })
                    .ToList();

                var uniqueActorsReviewed = actors.Count;

                var directors = user.Reviews
                    .SelectMany(review => (review.Media.Directors ?? "").Split(","),
                        (review, director) => new { Director = director.Trim() })
                    .GroupBy(x => x.Director)
                    .Select(g => new
                    {
                        Genre = g.Key,
                        Count = g.Count()
                    })
                    .ToList();

                var uniqueDirectorsReviewed = directors.Count;

                var consecutiveDaysActive = CalculateConsecutiveActivity(user.Reviews);

                await UpdateMilestone(user, MilestoneType.ReviewsWritten, user.Reviews.Count);
                await UpdateMilestone(user, MilestoneType.MoviesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Movie));
                await UpdateMilestone(user, MilestoneType.GamesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Game));
                await UpdateMilestone(user, MilestoneType.SeriesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Series));

                await UpdateMilestone(user, MilestoneType.SingleGenreReviewed, genres.Count == 0 ? 0 : genres.Max(g => g.Count));
                await UpdateMilestone(user, MilestoneType.GenreVariety, uniqueGenresReviewed);
                await UpdateMilestone(user, MilestoneType.SingleActorReviewed, actors.Count == 0 ? 0 : actors.Max(g => g.Count));
                await UpdateMilestone(user, MilestoneType.ActorVariety, uniqueActorsReviewed);
                await UpdateMilestone(user, MilestoneType.SingleDirectorReviewed, directors.Count == 0 ? 0 : directors.Max(g => g.Count));
                await UpdateMilestone(user, MilestoneType.DirectorVariety, uniqueDirectorsReviewed);

                await UpdateMilestone(user, MilestoneType.MonthlyReviews, user.Reviews.Count(r => r.Date.Month == DateTime.Now.Month));
                await UpdateMilestone(user, MilestoneType.YearlyReviews, user.Reviews.Count(r => r.Date.Year == DateTime.Now.Year));
                await UpdateMilestone(user, MilestoneType.ConsecutiveActivity, consecutiveDaysActive);
            }
        }

        public async Task UpdateUserBacklogMilestones(User user)
        {

            if (user != null)
            {
                await UpdateMilestone(user, MilestoneType.BacklogAdded, user.Backlogs.Count);
                await UpdateMilestone(user, MilestoneType.FinishedMedia, user.Backlogs.Count(b => b.Category == BacklogCategoryType.Finished));
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
            var genres = user.Reviews
                .Where(review => review.Media.Genres != "N/A")
                .SelectMany(review => (review.Media.Genres ?? "").Split(","),
                    (review, genre) => new { Genre = genre.Trim() })
                .GroupBy(x => x.Genre)
                .Select(g => new
                {
                    Genre = g.Key,
                    Count = g.Count()
                })
                .ToList();

            var uniqueGenresReviewed = genres.Count;

            var actors = user.Reviews
                .Where(review => review.Media.Actors != "N/A")
                .SelectMany(review => (review.Media.Actors ?? "").Split(","),
                    (review, actor) => new { Actor = actor.Trim() })
                .GroupBy(x => x.Actor)
                .Select(g => new
                {
                    Genre = g.Key,
                    Count = g.Count()
                })
                .ToList();

            var uniqueActorsReviewed = actors.Count;

            var directors = user.Reviews
                 .Where(review => review.Media.Directors != "N/A")
                .SelectMany(review => (review.Media.Directors ?? "").Split(","),
                    (review, director) => new { Director = director.Trim() })
                .GroupBy(x => x.Director)
                .Select(g => new
                {
                    Genre = g.Key,
                    Count = g.Count()
                })
                .ToList();

            var uniqueDirectorsReviewed = directors.Count;

            var consecutiveDaysActive = CalculateConsecutiveActivity(user.Reviews);


            // Fetch earned milestones

            // Define dynamic milestone types and data
            var milestonesData = new List<(MilestoneType Type, int Count)>
        {
            (MilestoneType.ReviewsWritten, user.Reviews.Count),
            (MilestoneType.MoviesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Movie)),
            (MilestoneType.SeriesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Series)),
            (MilestoneType.GamesReviewed, user.Reviews.Count(r => r.MediaType == MediaType.Game)),

            (MilestoneType.BacklogAdded, user.Backlogs.Count),
            (MilestoneType.FinishedMedia, user.Backlogs.Count(b => b.Category == BacklogCategoryType.Finished)),

            (MilestoneType.SingleGenreReviewed, genres.Count == 0 ? 0 : genres.Max(g => g.Count)),
            (MilestoneType.GenreVariety, uniqueGenresReviewed),
            (MilestoneType.SingleActorReviewed, actors.Count == 0 ? 0 : actors.Max(g => g.Count)),
            (MilestoneType.ActorVariety, uniqueActorsReviewed),
            (MilestoneType.SingleDirectorReviewed, directors.Count == 0 ? 0 : directors.Max(g => g.Count)),
            (MilestoneType.DirectorVariety, uniqueDirectorsReviewed),

            (MilestoneType.MonthlyReviews, user.Reviews.Count(r => r.Date.Month == DateTime.Now.Month)),
            (MilestoneType.YearlyReviews, user.Reviews.Count(r => r.Date.Year == DateTime.Now.Year)),
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
                or MilestoneType.SingleActorReviewed
                or MilestoneType.SingleDirectorReviewed
                or MilestoneType.MonthlyReviews =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 1 },
                        { MilestoneLevel.Silver, 5 },
                        { MilestoneLevel.Gold, 10 },
                        { MilestoneLevel.Platinum, 20 }
                    },
                MilestoneType.GenreVariety
                or MilestoneType.ActorVariety
                or MilestoneType.DirectorVariety =>
                    new Dictionary<MilestoneLevel, int>
                    {
                        { MilestoneLevel.None, 0 },
                        { MilestoneLevel.Bronze, 5 },
                        { MilestoneLevel.Silver, 10 },
                        { MilestoneLevel.Gold, 25 },
                        { MilestoneLevel.Platinum, 50 }

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
            var dynamicNextLevel = thresholds.FirstOrDefault(t => currentCount < t.Value).Key;
            var fromStoredNextLevel = thresholds.FirstOrDefault(t => t.Key == earnedLevel + 1).Key;
            var nextLevel = fromStoredNextLevel >= dynamicNextLevel ? fromStoredNextLevel : dynamicNextLevel;

            var progressPercent = Math.Round(nextLevel != MilestoneLevel.None
                ? (double)currentCount / thresholds[nextLevel] * 100
                : 100);

            return new MilestoneModel
            {
                Title = GetTitle(type),
                Description = GetDescription(type),
                Type = type,
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
                MilestoneType.SingleActorReviewed => "Single Actor",
                MilestoneType.ActorVariety => "Unique Actors",
                MilestoneType.SingleDirectorReviewed => "Single Director",
                MilestoneType.DirectorVariety => "Unique Directors",
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
                MilestoneType.SingleActorReviewed => "Focus on reviewing a single actors media",
                MilestoneType.ActorVariety => "Review media across multiple actors media",
                MilestoneType.SingleDirectorReviewed => "Focus on reviewing a single directors media",
                MilestoneType.DirectorVariety => "Review media across multiple directors media",
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
                MilestoneType.SingleActorReviewed => MilestoneCategory.Variety,
                MilestoneType.ActorVariety => MilestoneCategory.Variety,
                MilestoneType.SingleDirectorReviewed => MilestoneCategory.Variety,
                MilestoneType.DirectorVariety => MilestoneCategory.Variety,
                MilestoneType.MonthlyReviews => MilestoneCategory.Activity,
                MilestoneType.YearlyReviews => MilestoneCategory.Activity,
                MilestoneType.ConsecutiveActivity => MilestoneCategory.Activity,
                _ => throw new ArgumentOutOfRangeException(nameof(type), $"Unhandled type: {type}")
            };
        }
    }
}
