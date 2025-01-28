using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EngagementController(DatabaseContext databaseContext, MilestoneCalculatorHelper milestoneCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;

        [HttpGet("[action]/{reviewId}/{userId}")]
        public async Task<IActionResult> GetUserEngagement(int reviewId, int userId)
        {
            var engagement = await _databaseContext.Engagements
                .SingleOrDefaultAsync(e => e.ReviewId == reviewId && e.UserId == userId);

            if (engagement == null)
                return NotFound("Engagemnet not found");

            return Ok(engagement.Type);
        }

        [Route("[action]/{reviewId}/{userId}/{type}")]
        public async Task<IActionResult> ToggleEngagement(int userId, int reviewId, EngagementType type)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Engagements)
                .Include(u => u.Milestones)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

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
            {
                engagement.Type = type;
            }

            await _databaseContext.SaveChangesAsync();
            await _milestoneCalculatorHelper.UpdateEngagementMilestones(user);

            if (type == EngagementType.None)
                return NoContent();

            return Ok(type);
        }
    }
}
