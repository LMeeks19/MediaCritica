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
        [Route("[action]/{userId}/{offset}")]
        public async Task<List<BacklogModel>> GetBacklog(int userId, int offset)
        {
            var backlog = await _databaseContext.Backlogs
              .Where(media => media.UserId == userId)
              .Select(media => new BacklogModel()
              {
                  Id = media.Id,
                  UserId = media.UserId,
                  MediaId = media.MediaId,
                  MediaPoster = media.MediaPoster,
                  MediaTitle = media.MediaTitle,
                  MediaType = media.MediaType,
              }).OrderBy(media => media.MediaTitle)
              .Skip(offset)
              .Take(20)
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
    }
}


