using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BacklogController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;
        private readonly IDateTimeProviderHelper dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpGet("[action]")]
        public async Task<IActionResult> GetBacklog()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var backlog = new BacklogObjectModel
            {
                Backlog = await GetBacklogByCategory(userId, BacklogCategoryType.Backlog, 0, 10),
                TotalBacklogCount = await GetBacklogCount(userId, BacklogCategoryType.Backlog),

                InProgress = await GetBacklogByCategory(userId, BacklogCategoryType.InProgress, 0, 10),
                TotalInProgressCount = await GetBacklogCount(userId, BacklogCategoryType.InProgress),

                Finished = await GetBacklogByCategory(userId, BacklogCategoryType.Finished, 0, 10),
                TotalFinishedCount = await GetBacklogCount(userId, BacklogCategoryType.Finished),
            };

            return Ok(backlog);
        }

        private async Task<List<BacklogModel>> GetBacklogByCategory(int? userId, BacklogCategoryType category, int offset, int limit)
        {
            if (userId == null)
                return [];

            var backlog = await _databaseContext.Backlogs
                .Where(media => media.UserId == userId && media.Category == category)
                .OrderByDescending(media => media.AddedDate)
                .ThenBy(media => media.MediaTitle)
                .Select(media => _mapper.BacklogMapper.MapBacklogModel(media))
                .Skip(offset)
                .Take(limit)
                .ToListAsync();

            return backlog;
        }

        private async Task<int> GetBacklogCount(int? userId, BacklogCategoryType category)
        {
            if (userId == null)
                return 0;
            return await _databaseContext.Backlogs.CountAsync(backlog => backlog.UserId == userId && backlog.Category == category);
        }

        [HttpGet("[action]/{offset}/{limit}")]
        public async Task<IActionResult> GetBackloggedBacklog(int offset = 0, int limit = 10)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            return Ok(await GetBacklogByCategory(userId, BacklogCategoryType.Backlog, offset, limit));
        }

        [HttpGet("[action]/{offset}/{limit}")]
        public async Task<IActionResult> GetInProgressBacklog(int offset = 0, int limit = 10)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            return Ok(await GetBacklogByCategory(userId, BacklogCategoryType.InProgress, offset, limit));
        }

        [HttpGet("[action]/{offset}/{limit}")]
        public async Task<IActionResult> GetFinishedBacklog(int offset = 0, int limit = 10)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            return Ok(await GetBacklogByCategory(userId, BacklogCategoryType.Finished, offset, limit));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostBacklog([FromBody] BacklogModel backlogModel)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            if (!await _databaseContext.Users.AnyAsync(u => u.Id == userId))
                return NotFound(new { Message = "User not found" });

            if (!await _databaseContext.Media.AnyAsync(m => m.Id == backlogModel.MediaId))
                return NotFound(new { Message = "Media not found" });

            var backlogData = _mapper.BacklogMapper.MapBacklog(backlogModel, (int)userId!, dateTimeProviderHelper);

            await _databaseContext.Backlogs.AddAsync(backlogData);
            await _databaseContext.SaveChangesAsync();

            var user = await _databaseContext.Users
                .Include(user => user.Backlogs)
                .Include(user => user.Milestones)
                .FirstAsync(user => user.Id == backlogData.UserId);

            await _helper.MilestoneCalculatorHelper.UpdateUserBacklogMilestones(user);

            return Ok(new { Message = $"{backlogModel.MediaTitle} added to backlog" });
        }

        [HttpDelete("[action]/{mediaId}")]
        public async Task<IActionResult> DeleteBacklog(string mediaId)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var user = await _databaseContext.Users
                .Include(u => u.Backlogs)
                .Include(u => u.Milestones)
                .FirstAsync(u => u.Id == userId);

            var backlog = user.Backlogs.SingleOrDefault(r => r.MediaId == mediaId);

            if (backlog == null)
                return NotFound(new { Message = "Backlog not found" });

            _databaseContext.Backlogs.Remove(backlog);
            await _databaseContext.SaveChangesAsync();

            await _helper.MilestoneCalculatorHelper.UpdateUserBacklogMilestones(user);

            return Ok(new { Message = $"{backlog.MediaTitle} removed from backlog" });
        }

        [HttpPut("[action]/{backlogId}/{newState}")]
        public async Task<IActionResult> UpdateBacklogState(int backlogId, BacklogCategoryType newState)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Backlogs)
                .Include(u => u.Milestones)
                .FirstOrDefaultAsync(u => u.Backlogs.Any(b => b.Id == backlogId));

            if (user == null)
                return NotFound(new { Message = "Backlog not found" });

            var backlog = user.Backlogs.Single(b => b.Id == backlogId);

            backlog.Category = newState;

            await _databaseContext.SaveChangesAsync();

            await _helper.MilestoneCalculatorHelper.UpdateUserBacklogMilestones(user);

            return Ok(new { Message = $"Backlog {backlog.Id} updated to {backlog.Category} state" });
        }

        [HttpGet("[action]/{mediaId}")]
        public async Task<IActionResult> GetUserBacklogStatus(string mediaId)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var isBacklogged = await _databaseContext.Backlogs.AnyAsync(b => b.MediaId == mediaId && b.UserId == userId);

            return Ok(new { Value = isBacklogged });

        }
    }
}


