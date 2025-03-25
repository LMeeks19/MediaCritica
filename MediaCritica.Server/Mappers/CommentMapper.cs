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
                CommenterName = commentModel.CommenterName!,
                CommentedAt = dateTimeProviderHelper.UtcNow,
                IsDeleted = false
            };
        }

        public CommentModel MapCommentModel(Comment comment, List<CommentModel> children, int totalChildren)
        {
            return new CommentModel()
            {
                Id = comment.Id,
                ParentId = comment.ParentId,
                ReviewId = comment.ReviewId,
                Content = comment.IsDeleted ? null : comment.Content,
                CommenterId = comment.IsDeleted ? null : comment.CommenterId,
                CommenterName = comment.IsDeleted ? null : comment.CommenterName,
                CommentedAt = comment.IsDeleted ? null : comment.CommentedAt,
                IsDeleted = comment.IsDeleted,
                Replies = children,
                TotalChildren = totalChildren
            };
        }
    }
}
