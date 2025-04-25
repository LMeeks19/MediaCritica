using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class FollowMapper
    {
        public UserFollow MapFollow(UserFollowModel userFollowModel, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollow
            {
                Id = userFollowModel.Id,
                FollowerId = userFollowModel.FollowerId,
                FollowedId = userFollowModel.FollowedId,
                FollowedOn = dateTimeProviderHelper.UtcNow,
                EnabledNotifications = userFollowModel.EnabledNotifications,
            };
        }

        public UserFollowModel MapFollowModel(UserFollow userFollow, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowModel
            {
                Id = userFollow.Id,
                FollowerId = userFollow.FollowerId,
                FollowedId = userFollow.FollowedId,
                FollowedOn = dateTimeProviderHelper.GetLocalDate(userFollow.FollowedOn, preference),
                EnabledNotifications = userFollow.EnabledNotifications,
            };
        }

        public UserFollowSummaryModel MapFollowedSummaryModel(UserFollow userFollow, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowSummaryModel
            {
                Id = userFollow.Id,
                Username = userFollow.Followed.Username,
                Name = userFollow.Followed.FullName,
                FollowedOn = dateTimeProviderHelper.GetLocalDate(userFollow.FollowedOn, preference),
            };
        }

        public UserFollowSummaryModel MapFollowerSummaryModel(UserFollow userFollow, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowSummaryModel
            {
                Id = userFollow.Id,
                Username = userFollow.Follower.Username,
                Name = userFollow.Follower.FullName,
                FollowedOn = dateTimeProviderHelper.GetLocalDate(userFollow.FollowedOn, preference),
            };
        }
    }
}
