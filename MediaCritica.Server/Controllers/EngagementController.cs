using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EngagementController(DatabaseContext databaseContext, IHelpers helper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHelpers _helper = helper;

        [HttpGet("[action]/{reviewId}/{userId}")]
        public async Task<IActionResult> GetUserEngagement(int reviewId, int userId)
        {
            if (!await _databaseContext.Users.AnyAsync(u => u.Id == userId))
                return NotFound(new { Message = "User not found" });

            if (!await _databaseContext.Reviews.AnyAsync(r => r.Id == reviewId))
                return NotFound(new { Message = "Review not found" });

            var engagement = await _databaseContext.Engagements
                .SingleOrDefaultAsync(e => e.ReviewId == reviewId && e.UserId == userId);

            return Ok(engagement?.Type ?? EngagementType.None);
        }

        [Route("[action]/{reviewId}/{userId}/{type}")]
        public async Task<IActionResult> ToggleEngagement(int userId, int reviewId, EngagementType type)
        {
            if (!await _databaseContext.Reviews.AnyAsync(r => r.Id == reviewId))
                return NotFound(new { Message = "Review not found" });

            var user = await _databaseContext.Users
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Engagements)
                .Include(u => u.Milestones)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            var engagement = user.Engagements.FirstOrDefault(e => e.ReviewId == reviewId);

            if (engagement != null && type == EngagementType.None)
            {
                _databaseContext.Engagements.Remove(engagement);
            }
            else if (engagement == null && type != EngagementType.None)
            {
                engagement = new Engagement
                {
                    UserId = userId,
                    ReviewId = reviewId,
                    Type = type,
                };

                _databaseContext.Engagements.Add(engagement);
            }
            else if (engagement != null && type != EngagementType.None)
                engagement.Type = type;

            await _databaseContext.SaveChangesAsync();
            await _helper.MilestoneCalculatorHelper.UpdateEngagementMilestones(user);

            if (!await _databaseContext.Engagements.AnyAsync(e => e.Id == engagement!.Id))
                return Ok(EngagementType.None);

            return Ok(engagement!.Type);
        }
    }
}
