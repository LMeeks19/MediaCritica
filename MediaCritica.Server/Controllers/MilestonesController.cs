using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MilestonesController(DatabaseContext databaseContext, MilestoneCalculatorHelper milestoneCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;

        [HttpGet(Name = "GetUserMilestones")]
        [Route("[action]/{userId}")]
        public async Task<List<MilestoneCategoryModel>> GetUserMilestones(int userId)
        {
            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Engagements)
                .Include(user => user.Backlogs)
                .Include(user => user.Engagements)
                .Include(user => user.Milestones)
                .Include(user => user.Followers)
                .Include(user => user.Following)
                .FirstAsync(user => user.Id == userId);

            var milestones = _milestoneCalculatorHelper.GetUserMilestones(user);

            var milestonesByCategory = milestones
                .GroupBy(a => a.Category)
                .Select(group => new MilestoneCategoryModel
                {
                    Category = group.Key.ToString(),
                    Milestones = [.. group]
                }).ToList();

            return milestonesByCategory;
        }
    }
}
