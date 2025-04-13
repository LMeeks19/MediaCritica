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
                CommenterId = commentModel.CommenterId,
                CommentedAt = dateTimeProviderHelper.UtcNow,
                IsDeleted = false
            };
        }

        public CommentModel MapCommentModel(Comment comment, List<CommentModel> replies, int totalReplies)
        {
            return new CommentModel()
            {
                Id = comment.Id,
                ParentId = comment.ParentId,
                ReviewId = comment.ReviewId,
                Content = (comment.IsDeleted || comment.Reports.Count >= 5) ? null : comment.Content,
                CommenterId = (comment.IsDeleted || comment.Reports.Count >= 5) ? null : comment.CommenterId,
                CommenterUsername = (comment.IsDeleted || comment.Reports.Count >= 5) ? null : comment.Commenter.Username,
                CommentedAt = (comment.IsDeleted || comment.Reports.Count >= 5) ? null : comment.CommentedAt,
                IsDeleted = comment.IsDeleted,
                Replies = replies,
                TotalReplies = totalReplies,
            };
        }
    }
}
