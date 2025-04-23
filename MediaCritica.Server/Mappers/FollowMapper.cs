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

        public UserFollowModel MapFollowModel(UserFollow userFollow, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowModel
            {
                Id = userFollow.Id,
                FollowerId = userFollow.FollowerId,
                FollowedId = userFollow.FollowedId,
                FollowedOn = dateTimeProviderHelper.GetLocalDateTime(userFollow.FollowedOn, userFollow.Follower.Preference.Timezone),
                EnabledNotifications = userFollow.EnabledNotifications,
            };
        }

        public UserFollowSummaryModel MapFollowedSummaryModel(UserFollow userFollow, string timezone, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowSummaryModel
            {
                Id = userFollow.Id,
                Username = userFollow.Followed.Username,
                Name = userFollow.Followed.FullName,
                FollowedOn = dateTimeProviderHelper.GetLocalDateTime(userFollow.FollowedOn, timezone),
            };
        }

        public UserFollowSummaryModel MapFollowerSummaryModel(UserFollow userFollow, string timezone, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new UserFollowSummaryModel
            {
                Id = userFollow.Id,
                Username = userFollow.Follower.Username,
                Name = userFollow.Follower.FullName,
                FollowedOn = dateTimeProviderHelper.GetLocalDateTime(userFollow.FollowedOn, timezone),
            };
        }
    }
}
