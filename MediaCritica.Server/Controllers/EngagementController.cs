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

        [HttpGet(Name = "GetUserEngagement")]
        [Route("[action]/{reviewId}/{userId}")]
        public async Task<EngagementType?> GetUserEngagement(int reviewId, int userId)
        {
            var engagement = await _databaseContext.Engagements
                .FirstOrDefaultAsync(e => e.ReviewId == reviewId && e.UserId == userId);

            return engagement?.Type ?? null;
        }

        [HttpGet(Name = "ToggleEngagement")]
        [Route("[action]/{reviewId}/{userId}/{type}")]
        public async Task<EngagementType?> ToggleEngagement(int userId, int reviewId, EngagementType type)
        {
            // Get User for milestone update
            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Engagements)
                .Include(user => user.Engagements)
                .Include(user => user.Milestones)
                .FirstAsync(user => user.Id == userId);

            // Get existing engagement
            var engagement = user.Engagements
                .FirstOrDefault(e => e.ReviewId == reviewId);

            if (engagement != null && type == EngagementType.None)
            {
                // Remove engagement 
                _databaseContext.Engagements.Remove(engagement);
            }
            else if (engagement == null && type != EngagementType.None)
            {
                // Create new engagement
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
                // Switch engagement
                engagement.Type = type;
            }

            await _databaseContext.SaveChangesAsync();

            await _milestoneCalculatorHelper.UpdateEngagementMilestones(user);

            return type != EngagementType.None ? type : null;
        }


    }
}
