using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FollowController(DatabaseContext databaseContext, IHelpers helper, IMappers mapper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHelpers _helper = helper;
        private readonly IMappers _mapper = mapper;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetUserFollowers(int offset)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Followers)
                    .ThenInclude(f => f.Follower)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            var followers = user.Followers
                .OrderByDescending(f => f.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(f => _mapper.FollowMapper.MapFollowerSummaryModel(f, user.Preference.Timezone, _dateTimeProviderHelper))
                .ToList();

            return Ok(followers);
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetUserFollowing(int offset)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Following)
                    .ThenInclude(f => f.Followed)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            var following = user.Following
                .OrderByDescending(f => f.FollowedOn)
                .Skip(offset)
                .Take(25)
                .Select(f => _mapper.FollowMapper.MapFollowedSummaryModel(f, user.Preference.Timezone, _dateTimeProviderHelper))
                .ToList();

            return Ok(following);
        }

        [HttpGet("[action]/{followedUsername}")]
        public async Task<IActionResult> GetUserFollowStatus(string followedUsername)
        {
            var followerId = _helper.AuthenticationHelper.GetUserId();
            var userFollow = await _databaseContext.UserFollows
                .Include(f => f.Followed)
                .Include(f => f.Follower)
                    .ThenInclude(f => f.Preference)
                .SingleOrDefaultAsync(f => f.FollowerId == followerId && f.Followed.Username == followedUsername);

            if (userFollow == null)
                return NotFound(new { Message = "Follow relationship not found" });

            return Ok(_mapper.FollowMapper.MapFollowModel(userFollow, _dateTimeProviderHelper));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> FollowUser([FromBody] UserFollowModel userFollowModel)
        {
            if (!await _databaseContext.Users.AnyAsync(u => u.Id == userFollowModel.FollowedId))
                return NotFound(new { Message = "User not found" });
            if (userFollowModel.FollowerId == userFollowModel.FollowedId)
                return BadRequest(new { Message = "Users cannot follow themselves" });
            if (await _databaseContext.UserFollows.AnyAsync(f => f.FollowerId == userFollowModel.FollowerId && f.FollowedId == userFollowModel.FollowedId))
                return Conflict(new { Message = "User is already following" });

            var newFollow = _mapper.FollowMapper.MapFollow(userFollowModel, _dateTimeProviderHelper);

            await _databaseContext.UserFollows.AddAsync(newFollow);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "User followed" });
        }

        [HttpDelete("[action]/{userFollowId}")]
        public async Task<IActionResult> UnfollowUser(int userFollowId)
        {
            var follow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(f => f.Id == userFollowId);

            if (follow == null)
                return NotFound(new { Message = "Follow relationship not found" });

            _databaseContext.UserFollows.Remove(follow);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "User unfollowed" });
        }

        [HttpPut("[action]/{userFollowId}")]
        public async Task<IActionResult> ToggleNotificationStatus(int userFollowId)
        {
            var userFollow = await _databaseContext.UserFollows
                .SingleOrDefaultAsync(f => f.Id == userFollowId);

            if (userFollow == null)
                return NotFound(new { Message = "Follow relationship not found" });

            userFollow.EnabledNotifications = !userFollow.EnabledNotifications;
            await _databaseContext.SaveChangesAsync();

            return Ok(userFollow.EnabledNotifications);
        }
    }
}
