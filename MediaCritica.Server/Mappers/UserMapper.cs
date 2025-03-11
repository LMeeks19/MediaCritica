using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class UserMapper(IHelpers helper, IMappers mapper)
    {
        private readonly IHelpers _helper = helper;
        private readonly IMappers _mapper = mapper;

        public User MapUser(CreateUserModel userModel)
        {
            var user = new User
            {
                Forename = userModel.Forename,
                Surname = userModel.Surname,
                Email = userModel.Email,
                Password = userModel.Password,
                Joined = DateOnly.MaxValue,
                Preference = new Preference()
                {
                    Theme = "System",
                    Palette = "#971212"
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
                Forename = user.Forename,
                Surname = user.Surname,
                Email = user.Email,
                Password = user.Password,
                Preference = new PreferenceModel
                {
                    Id = user.Preference.Id,
                    Theme = user.Preference.Theme,
                    Palette = user.Preference.Palette,
                },
                TotalReviews = user.Reviews.Count,
                TotalBacklogs = user.Backlogs.Count,
                TotalNotifications = user.Notifications.Count,
                TotalFollowers = user.Followers.Count,
                TotalFollowing = user.Following.Count,
            };

            return userModel;
        }

        public UserSummaryModel MapUserSummaryModel(User user)
        {
            var viewUserSummaryModel = new UserSummaryModel()
            {
                Id = user.Id,
                Name = $"{user.Forename} {user.Surname}",
                Joined = user.Joined,
                Reviews = user.Reviews
                     .OrderByDescending(r => r.Date)
                     .ThenByDescending(r => r.Rating)
                     .Take(8)
                     .Select(_mapper.ReviewMapper.MapReviewModel)
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

        private List<double> MapReviewBreakdown(List<Review> reviews)
        {
            var reviewBreakdown = Enumerable.Range(0, 11)
                .Select(r => r * 0.5)
                .Select(rating => (double)reviews.Count(r => r.Rating == rating))
                .ToList();

            return reviewBreakdown;
        }
    }
}

