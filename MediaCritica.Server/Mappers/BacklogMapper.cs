using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class BacklogMapper
    {
        public Backlog MapBacklog(BacklogModel backlogModel, int userId, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new Backlog()
            {
                UserId = userId,
                AddedDate = dateTimeProviderHelper.UtcNow,
                Category = backlogModel.Category,
                MediaId = backlogModel.MediaId,
                MediaPoster = backlogModel.MediaPoster,
                MediaTitle = backlogModel.MediaTitle,
                MediaType = backlogModel.MediaType,
            };
        }

        public BacklogModel MapBacklogModel(Backlog backlog, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new BacklogModel()
            {
                Id = backlog.Id,
                AddedDate = backlog.AddedDate,
                Category = backlog.Category,
                MediaId = backlog.MediaId,
                MediaPoster = backlog.MediaPoster,
                MediaTitle = backlog.MediaTitle,
                MediaType = backlog.MediaType,
            };
        }

        public BacklogSummaryModel MapBacklogSummaryModel(Backlog backlog)
        {
            return new BacklogSummaryModel()
            {
                Id = backlog.Id,
                MediaId = backlog.MediaId
            };
        }
    }
}
