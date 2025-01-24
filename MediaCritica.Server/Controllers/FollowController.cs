using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FollowController(DatabaseContext databaseContext) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        [HttpGet(Name = "GetUserFollowers")]
        [Route("[action]/{userId}/{offset}")]
        public async Task<UserFollowSummaryObjectModel> GetUserFollowers(int userId, int offset)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Followers)
                .ThenInclude(f => f.Follower)
                .SingleAsync(u => u.Id == userId);

            var followers = user.Followers
                .OrderByDescending(follow => follow.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(follow => new UserFollowSummaryModel()
                {
                    UserId = follow.Follower.Id,
                    Name = $"{follow.Follower.Forename} {follow.Follower.Surname}",
                    FollowedOn = follow.FollowedOn,
                })
                .ToList();

            return new UserFollowSummaryObjectModel()
            {
                Count = user.Followers.Count,
                Data = followers
            };
        }

        [HttpGet(Name = "GetUserFollowing")]
        [Route("[action]/{userId}/{offset}")]
        public async Task<UserFollowSummaryObjectModel> GetUserFollowing(int userId, int offset)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Following)
                .ThenInclude(f => f.Followed)
                .SingleAsync(u => u.Id == userId);

            var following = user.Following
                .OrderByDescending(follow => follow.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(follow => new UserFollowSummaryModel()
                {
                    UserId = follow.Followed.Id,
                    Name = $"{follow.Followed.Forename} {follow.Followed.Surname}",
                    FollowedOn = follow.FollowedOn,
                })
                .ToList();

            return new UserFollowSummaryObjectModel()
            {
                Count = user.Following.Count,
                Data = following
            };
        }

        [HttpGet(Name = "GetUserFollowStatus")]
        [Route("[action]/{followerId}/{followedId}")]
        public async Task<UserFollowModel?> GetUserFollowStatus(int followerId, int followedId)
        {
            var userFollow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(follow => follow.FollowerId == followerId && follow.FollowedId == followedId);

            if (userFollow == null)
                return null;

            return new UserFollowModel()
            {
                Id = userFollow.Id,
                FollowerId = userFollow.FollowerId,
                FollowedId = userFollow.FollowedId,
                FollowedOn = userFollow.FollowedOn,
                EnabledNotifications = userFollow.EnabledNotifications,
            };
        }


        [HttpPost(Name = "FollowUser")]
        [Route("[action]")]
        public async Task<UserFollowModel> FollowUser([FromBody] UserFollowModel userFollowModel)
        {
            if (userFollowModel.FollowerId == userFollowModel.FollowedId)
                throw new InvalidOperationException("Users cannot follow themselves.");

            var alreadyFollowing = await _databaseContext.UserFollows
                .AnyAsync(uf => uf.FollowerId == userFollowModel.FollowerId && uf.FollowedId == userFollowModel.FollowedId);

            if (alreadyFollowing)
                throw new InvalidOperationException("User is already following.");

            var newFollow = new UserFollow
            {
                FollowerId = userFollowModel.FollowerId,
                FollowedId = userFollowModel.FollowedId,
                FollowedOn = userFollowModel.FollowedOn,
                EnabledNotifications = userFollowModel.EnabledNotifications,
            };

            await _databaseContext.UserFollows.AddAsync(newFollow);
            await _databaseContext.SaveChangesAsync();

            var follow = _databaseContext.UserFollows.Single(follow => follow.FollowerId == follow.FollowerId && follow.FollowedId == userFollowModel.FollowedId);

            return new UserFollowModel()
            {
                Id = follow.Id,
                FollowerId = follow.FollowerId,
                FollowedId = follow.FollowedId,
                FollowedOn = follow.FollowedOn,
                EnabledNotifications = follow.EnabledNotifications,
            };
        }

        [HttpDelete(Name = "UnfollowUser")]
        [Route("[action]/{userFollowId}")]
        public async Task UnfollowUser(int userFollowId)
        {
            var follow = await _databaseContext.UserFollows
                .SingleAsync(follow => follow.Id == userFollowId);

            _databaseContext.UserFollows.Remove(follow);
            await _databaseContext.SaveChangesAsync();
        }


        [HttpPut(Name = "ToggleNotificationStatus")]
        [Route("[action]/{userFollowId}")]
        public async Task<bool?> ToggleNotificationStatus(int userFollowId)
        {
            var userFollow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(follow => follow.Id == userFollowId);

            if (userFollow == null)
                return null;

            userFollow.EnabledNotifications = !userFollow.EnabledNotifications;

            await _databaseContext.SaveChangesAsync();

            return userFollow.EnabledNotifications;
        }
    }
}
