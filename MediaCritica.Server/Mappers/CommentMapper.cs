using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class CommentMapper
    {
        public Comment MapComment(CommentModel commentModel, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new Comment()
            {
                Id = commentModel.Id,
                ReviewId = commentModel.ReviewId,
                ParentId = commentModel.ParentId,
                Content = commentModel.Content!,
                CommenterId = (int)commentModel.CommenterId!,
                CommentedAt = dateTimeProviderHelper.UtcNow,
            };
        }

        public CommentModel MapCommentModel(Comment comment, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper, List<CommentModel> replies, int totalReplies)
        {
            return new CommentModel()
            {
                Id = comment.Id,
                ParentId = comment.ParentId,
                ReviewId = comment.ReviewId,
                Content = (comment.Status != ContentStatus.Active || comment.Reports.Count >= 5) ? null : comment.Content,
                CommenterId = (comment.Status != ContentStatus.Active || comment.Reports.Count >= 5) ? null : comment.CommenterId,
                CommenterUsername = (comment.Status != ContentStatus.Active || comment.Reports.Count >= 5) ? null : comment.Commenter.Username,
                CommentedAt = (comment.Status != ContentStatus.Active || comment.Reports.Count >= 5) ? null : dateTimeProviderHelper.GetDateTimeDistance(dateTimeProviderHelper.UtcNow, comment.CommentedAt),
                Replies = replies,
                TotalReplies = totalReplies,
                Status = comment.Status,
            };
        }
    }
}
