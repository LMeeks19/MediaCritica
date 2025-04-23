using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MilestoneController(DatabaseContext databaseContext, IHelpers helper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHelpers _helper = helper;

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUserMilestones()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Media)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Backlogs)
                .Include(u => u.Engagements)
                .Include(u => u.Milestones)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            var milestones = _helper.MilestoneCalculatorHelper.GetUserMilestones(user);

            var milestonesByCategory = milestones
                .GroupBy(m => m.Category)
                .Select(group => new MilestoneCategoryModel
                {
                    Category = group.Key.ToString(),
                    Milestones = [.. group]
                })
                .ToList();

            return Ok(milestonesByCategory);
        }
    }
}
