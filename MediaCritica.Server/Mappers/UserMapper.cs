using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class UserMapper(IHelpers helper, ReviewMapper reviewMapper)
    {
        private readonly IHelpers _helper = helper;
        private readonly ReviewMapper _reviewMapper = reviewMapper;

        public User MapUser(CreateUserModel userModel, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            var user = new User
            {
                Username = userModel.Username,
                Forename = userModel.Forename,
                Surname = userModel.Surname,
                Email = userModel.Email,
                Password = userModel.Password,
                Joined = dateTimeProviderHelper.UtcNow,
                Preference = new Preference()
                {
                    Theme = "System",
                    Palette = "#971212",
                    Locale = userModel.Locale,
                    Timezone = userModel.Timezone,
                },
                Milestones = _helper.MilestoneCalculatorHelper.CreateMilestones()
            };

            return user;
        }

        public UserModel MapUserModel(User user)
        {
            var userModel = new UserModel()
            {
                Id = user.Id,
                Username = user.Username,
                Forename = user.Forename,
                Surname = user.Surname,
                Email = user.Email,
                Preference = user.Preference != null ? MapPreference(user.Preference) : null,
                TotalReviews = user.Reviews.Count,
                TotalBacklogs = user.Backlogs.Count,
                TotalNotifications = user.Notifications.Count,
                TotalFollowers = user.Followers.Count,
                TotalFollowing = user.Following.Count,
            };

            return userModel;
        }

        public PreferenceModel MapPreference(Preference preference)
        {
            var preferenceModel = new PreferenceModel()
            {
                Id = preference.Id,
                Theme = preference.Theme,
                Palette = preference.Palette,
                Locale = preference.Locale,
                Timezone = preference.Timezone,
            };
            return preferenceModel;
        }

        public UserSummaryModel MapUserSummaryModel(User user, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            var viewUserSummaryModel = new UserSummaryModel()
            {
                Id = user.Id,
                Username = user.Username,
                Joined = dateTimeProviderHelper.GetLocalDate(user.Joined, preference),
                Reviews = user.Reviews
                     .OrderByDescending(r => r.Date)
                     .ThenByDescending(r => r.Rating)
                     .Take(8)
                     .Select(r => _reviewMapper.MapReviewModel(r, preference, dateTimeProviderHelper))
                     .ToList(),
                Milestones = _helper.MilestoneCalculatorHelper
                     .GetUserMilestones(user)
                     .Where(m => m.EarnedLevel > MilestoneLevel.None && m.EarnedDate != null)
                     .OrderByDescending(m => m.EarnedDate)
                     .ThenByDescending(m => m.EarnedLevel)
                     .Take(5)
                     .ToList(),
                ReviewsWritten = user.Reviews.Count,
                MediaBacklogged = user.Backlogs.Count,
                Followers = user.Followers.Count,
                Following = user.Following.Count,
                EngagementsReceivedLikes = user.Reviews.Sum(r => r.Engagements.Count(e => e.Type == EngagementType.Like)),
                EngagementsReceivedDislikes = user.Reviews.Sum(r => r.Engagements.Count(e => e.Type == EngagementType.Dislike)),
                EngagementsGivenLikes = user.Engagements.Count(e => e.Type == EngagementType.Like),
                EngagementsGivenDislikes = user.Engagements.Count(e => e.Type == EngagementType.Dislike),
                MilestonesEarned = user.Milestones.Count(m => m.EarnedLevel > MilestoneLevel.None && m.EarnedDate != null),
                Breakdown = MapReviewBreakdown(user.Reviews)
            };

            return viewUserSummaryModel;
        }

        public UserSearchModel MapUserSearchModel(User user, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            var userSearchModel = new UserSearchModel()
            {
                Id = user.Id,
                Username = user.Username,
                Joined = dateTimeProviderHelper.GetLocalDate(user.Joined, preference),
            };

            return userSearchModel;
        }

        private static List<double> MapReviewBreakdown(List<Review> reviews)
        {
            var reviewBreakdown = Enumerable.Range(0, 11)
                .Select(r => r * 0.5)
                .Select(rating => (double)reviews.Count(r => r.Rating == rating))
                .ToList();

            return reviewBreakdown;
        }
    }
}

