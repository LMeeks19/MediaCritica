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

        [HttpGet("[action]/{userId}/{offset}")]
        public async Task<IActionResult> GetUserFollowers(int userId, int offset)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Followers)
                .ThenInclude(f => f.Follower)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound($"User not found");

            var followers = user.Followers
                .OrderByDescending(f => f.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(f => new UserFollowSummaryModel
                {
                    Id = f.Id,
                    UserId = f.Follower.Id,
                    Name = $"{f.Follower.Forename} {f.Follower.Surname}",
                    FollowedOn = f.FollowedOn,
                })
                .ToList();

            return Ok(followers);
        }

        [HttpGet("[action]/{userId}/{offset}")]
        public async Task<IActionResult> GetUserFollowing(int userId, int offset)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Following)
                .ThenInclude(f => f.Followed)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound($"User not found");

            var following = user.Following
                .OrderByDescending(f => f.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(f => new UserFollowSummaryModel
                {
                    Id = f.Id,
                    UserId = f.Followed.Id,
                    Name = $"{f.Followed.Forename} {f.Followed.Surname}",
                    FollowedOn = f.FollowedOn,
                })
                .ToList();

            return Ok(following);
        }

        [HttpGet("[action]/{followerId}/{followedId}")]
        public async Task<IActionResult> GetUserFollowStatus(int followerId, int followedId)
        {
            var userFollow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (userFollow == null)
                return NotFound("Follow relationship not found");

            return Ok(new UserFollowModel
            {
                Id = userFollow.Id,
                FollowerId = userFollow.FollowerId,
                FollowedId = userFollow.FollowedId,
                FollowedOn = userFollow.FollowedOn,
                EnabledNotifications = userFollow.EnabledNotifications,
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FollowUser([FromBody] UserFollowModel userFollowModel)
        {
            if (!await _databaseContext.Users.AnyAsync(u => u.Id == userFollowModel.FollowedId))
                return NotFound("User not found");
            if (userFollowModel.FollowerId == userFollowModel.FollowedId)
                return BadRequest("Users cannot follow themselves");
            if (await _databaseContext.UserFollows.AnyAsync(f => f.FollowerId == userFollowModel.FollowerId && f.FollowedId == userFollowModel.FollowedId))
                return Conflict("User is already following");

            var newFollow = new UserFollow
            {
                FollowerId = userFollowModel.FollowerId,
                FollowedId = userFollowModel.FollowedId,
                FollowedOn = userFollowModel.FollowedOn,
                EnabledNotifications = userFollowModel.EnabledNotifications,
            };

            await _databaseContext.UserFollows.AddAsync(newFollow);
            await _databaseContext.SaveChangesAsync();

            return Ok("User followed");
        }

        [HttpDelete("[action]/{userFollowId}")]
        public async Task<IActionResult> UnfollowUser(int userFollowId)
        {
            var follow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(f => f.Id == userFollowId);

            if (follow == null)
                return NotFound("Follow relationship not found");

            _databaseContext.UserFollows.Remove(follow);
            await _databaseContext.SaveChangesAsync();

            return Ok("User unfollowed");
        }

        [HttpPut("[action]/{userFollowId}")]
        public async Task<IActionResult> ToggleNotificationStatus(int userFollowId)
        {
            var userFollow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(f => f.Id == userFollowId);

            if (userFollow == null)
                return NotFound("Follow relationship not found");

            userFollow.EnabledNotifications = !userFollow.EnabledNotifications;
            await _databaseContext.SaveChangesAsync();

            return Ok(userFollow.EnabledNotifications);
        }
    }
}
