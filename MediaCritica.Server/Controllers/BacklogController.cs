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
    public class BacklogController(DatabaseContext databaseContext, IMapper mapper, MilestoneCalculatorHelper milestoneCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMapper _mapper = mapper;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;

        [HttpGet(Name = "GetBacklog")]
        [Route("[action]/{userId}")]
        public async Task<BacklogObjectModel> GetBacklog(int userId)
        {
            var backlog = new BacklogObjectModel
            {
                Backlog = await GetBackloggedBacklog(userId),
                TotalBacklogCount = GetBacklogCount(userId, BacklogCategoryType.Backlog),

                InProgress = await GetInProgressBacklog(userId),
                TotalInProgressCount = GetBacklogCount(userId, BacklogCategoryType.InProgress),

                Finished = await GetFinishedBacklog(userId),
                TotalFinishedCount = GetBacklogCount(userId, BacklogCategoryType.Finished),
            };

            return backlog;
        }

        public int GetBacklogCount(int userId, BacklogCategoryType category)
        {
            return _databaseContext.Backlogs.Count(backlog => backlog.UserId == userId && backlog.Category == category);
        }

        [HttpGet(Name = "GetBackloggedBacklog")]
        [Route("[action]/{userId}/{offset}/{limit}")]
        public async Task<List<BacklogModel>> GetBackloggedBacklog(int userId, int offset = 0, int limit = 10)
        {
            var backlog = await _databaseContext.Backlogs
              .Where(media => media.UserId == userId && media.Category == BacklogCategoryType.Backlog)
              .OrderByDescending(media => media.AddedDate)
                .ThenBy(media => media.MediaTitle)
              .Select(media => _mapper.BacklogMapper.MapBacklogModel(media))
              .Skip(offset)
              .Take(limit)
              .ToListAsync();

            return backlog;
        }

        [HttpGet(Name = "GetInProgressBacklog")]
        [Route("[action]/{userId}/{offset}/{limit}")]
        public async Task<List<BacklogModel>> GetInProgressBacklog(int userId, int offset = 0, int limit = 10)
        {
            var backlog = await _databaseContext.Backlogs
              .Where(media => media.UserId == userId && media.Category == BacklogCategoryType.InProgress)
              .OrderByDescending(media => media.AddedDate)
                .ThenBy(media => media.MediaTitle)
              .Select(media => _mapper.BacklogMapper.MapBacklogModel(media))
              .Skip(offset)
              .Take(limit)
              .ToListAsync();

            return backlog;
        }

        [HttpGet(Name = "GetFinishedBacklog")]
        [Route("[action]/{userId}/{offset}/{limit}")]
        public async Task<List<BacklogModel>> GetFinishedBacklog(int userId, int offset = 0, int limit = 10)
        {
            var backlog = await _databaseContext.Backlogs
              .Where(media => media.UserId == userId && media.Category == BacklogCategoryType.Finished)
              .OrderByDescending(media => media.AddedDate)
                .ThenBy(media => media.MediaTitle)
              .Select(media => _mapper.BacklogMapper.MapBacklogModel(media))
              .Skip(offset)
              .Take(limit)
              .ToListAsync();

            return backlog;
        }

        [HttpPost(Name = "PostBacklog")]
        [Route("[action]")]
        public async Task<BacklogSummaryModel> PostBacklog([FromBody] BacklogModel backlogModel)
        {
            var backlogData = _mapper.BacklogMapper.MapBacklog(backlogModel);

            await _databaseContext.Backlogs.AddAsync(backlogData);
            await _databaseContext.SaveChangesAsync();

            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Backlogs)
                .Include(user => user.Milestones)
                .FirstAsync(user => user.Id == backlogData.UserId);

            await _milestoneCalculatorHelper.UpdateUserMilestones(user);

            var newBacklog = user.Backlogs.Single(backlog => backlog.MediaId == backlogData.MediaId);

            return _mapper.BacklogMapper.MapBacklogSummaryModel(newBacklog);
        }

        [HttpDelete(Name = "DeleteBacklog")]
        [Route("[action]/{mediaId}/{userId}")]
        public async void DeleteBacklog(string mediaId, int userId)
        {
            var user = _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Backlogs)
                .Include(user => user.Milestones)
                .Where(user => user.Id == userId)
                .Single();

            var media = user.Backlogs.Single(r => r.MediaId == mediaId);

            _databaseContext.Backlogs.Remove(media);
            _databaseContext.SaveChanges();

            await _milestoneCalculatorHelper.UpdateUserMilestones(user);
        }

        [HttpPut(Name = "UpdateBacklogState")]
        [Route("[action]/{backlogId}/{newState}")]
        public async void UpdateBacklogState(int backlogId, BacklogCategoryType newState)
        {
            var user = _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Backlogs)
                .Include(user => user.Milestones)
                .Where(user => user.Backlogs.Any(b => b.Id == backlogId))
                .Single();

            var media = user.Backlogs.Single(b => b.Id == backlogId);
            media.Category = newState;

            _databaseContext.Backlogs.Update(media);
            _databaseContext.SaveChanges();

            await _milestoneCalculatorHelper.UpdateUserMilestones(user);
        }
    }
}


