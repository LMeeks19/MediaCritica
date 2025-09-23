using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class BacklogMapper
    {
        public async Task<Backlog> MapBacklog(BacklogModel backlogModel, int userId, IDateTimeProviderHelper dateTimeProviderHelper, ImageValidator imageValidator)
        {
            return new Backlog()
            {
                UserId = userId,
                AddedDate = dateTimeProviderHelper.UtcNow,
                Category = backlogModel.Category,
                MediaId = backlogModel.MediaId,
                MediaPoster = await imageValidator.GetValidImageUrlAsync(backlogModel.MediaPoster),
                MediaTitle = backlogModel.MediaTitle,
                MediaType = backlogModel.MediaType,
            };
        }

        public async Task<BacklogModel> MapBacklogModel(Backlog backlog, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper, ImageValidator imageValidator)
        {
            return new BacklogModel()
            {
                Id = backlog.Id,
                AddedDate = dateTimeProviderHelper.GetLocalDate(backlog.AddedDate, preference),
                Category = backlog.Category,
                MediaId = backlog.MediaId,
                MediaPoster = await imageValidator.GetValidImageUrlAsync(backlog.MediaPoster),
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
