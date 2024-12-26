using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BacklogController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public BacklogController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

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
              .Select(media => new BacklogModel()
              {
                  Id = media.Id,
                  UserId = media.UserId,
                  MediaId = media.MediaId,
                  MediaPoster = media.MediaPoster,
                  MediaTitle = media.MediaTitle,
                  MediaType = media.MediaType,
                  Category = media.Category,
                  AddedDate = media.AddedDate,
              }).OrderByDescending(media => media.AddedDate)
              .ThenBy(media => media.MediaTitle)
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
              .Select(media => new BacklogModel()
              {
                  Id = media.Id,
                  UserId = media.UserId,
                  MediaId = media.MediaId,
                  MediaPoster = media.MediaPoster,
                  MediaTitle = media.MediaTitle,
                  MediaType = media.MediaType,
                  Category = media.Category,
                  AddedDate = media.AddedDate,
              }).OrderByDescending(media => media.AddedDate)
              .ThenBy(media => media.MediaTitle)
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
              .Select(media => new BacklogModel()
              {
                  Id = media.Id,
                  UserId = media.UserId,
                  MediaId = media.MediaId,
                  MediaPoster = media.MediaPoster,
                  MediaTitle = media.MediaTitle,
                  MediaType = media.MediaType,
                  Category = media.Category,
                  AddedDate = media.AddedDate,
              }).OrderByDescending(media => media.AddedDate)
              .ThenBy(media => media.MediaTitle)
              .Skip(offset)
              .Take(limit)
              .ToListAsync();

            return backlog;
        }

        [HttpPost(Name = "PostBacklog")]
        [Route("[action]")]
        public async Task<BacklogSummaryModel> PostBacklog([FromBody] BacklogModel backlogModel)
        {
            var backlogData = new Backlog()
            {
                UserId = backlogModel.UserId,
                MediaId = backlogModel.MediaId,
                MediaPoster = backlogModel.MediaPoster,
                MediaTitle = backlogModel.MediaTitle,
                MediaType = backlogModel.MediaType,
                Category = BacklogCategoryType.Backlog,
                AddedDate = DateTime.UtcNow,
            };

            await _databaseContext.Backlogs.AddAsync(backlogData);
            await _databaseContext.SaveChangesAsync();

            var newBacklog = await _databaseContext.Backlogs.SingleAsync(backlog => backlog.MediaId == backlogData.MediaId && backlog.UserId == backlogData.UserId);

            return new BacklogSummaryModel()
            {
                Id = newBacklog.Id,
                MediaId = newBacklog.MediaId,
            };
        }

        [HttpDelete(Name = "DeleteBacklog")]
        [Route("[action]/{mediaId}/{userId}")]
        public void DeleteBacklog(string mediaId, int userId)
        {
            var backlog = _databaseContext.Backlogs
                .Single(backlog => backlog.MediaId == mediaId && backlog.UserId == userId);

            _databaseContext.Backlogs.Remove(backlog);
            _databaseContext.SaveChanges();
        }

        [HttpPut(Name = "UpdateBacklogState")]
        [Route("[action]/{backlogId}/{newState}")]
        public void UpdateBacklogState(int backlogId, BacklogCategoryType newState)
        {
            var backlog = _databaseContext.Backlogs
                .Single(backlog => backlog.Id == backlogId);

            backlog.Category = newState;

            _databaseContext.Backlogs.Update(backlog);
            _databaseContext.SaveChanges();
        }
    }
}


