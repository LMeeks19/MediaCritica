using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController(DatabaseContext databaseContext, DateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly DateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpGet("[action]/{reviewId}")]
        public async Task<IActionResult> GetReviewComments(int reviewId)
        {
            var comments = await _databaseContext.Comments
                .Where(c => c.ReviewId == reviewId)
                .Where(c => !c.IsDeleted || (c.IsDeleted && c.Children.Count > 0 && !c.Children.All(c => c.IsDeleted)))
                .OrderByDescending(c => c.CommentedAt)
                .ToListAsync();

            var rootComments = comments
                .Where(c => c.ParentId == null)
                .Select(c => new CommentModel
                {
                    Id = c.Id,
                    ParentId = c.ParentId,
                    ReviewId = c.ReviewId,
                    Comment = c.IsDeleted ? null : c.Message,
                    CommenterId = c.IsDeleted ? null : c.CommenterId,
                    CommenterName = c.IsDeleted ? null : c.CommenterName,
                    CommentedAt = c.IsDeleted ? null : c.CommentedAt,
                    IsDeleted = c.IsDeleted,
                    Children = GetCommentChildren(c.Id, comments, 0, 2),
                    TotalChildren = comments.Count(child => child.ParentId == c.Id)
                })
                .ToList();

            return Ok(rootComments);
        }

        private static List<CommentModel> GetCommentChildren(int parentId, List<Comment> allComments, int offset, int limit)
        {
            var children = allComments
                .Where(c => c.ParentId == parentId)
                .Where(c => !c.IsDeleted || (c.IsDeleted && c.Children.Count > 0 && !c.Children.All(c => c.IsDeleted)))
                .OrderByDescending(c => c.CommentedAt)
                .Skip(offset)
                .Take(limit)
                .Select(c => new CommentModel
                {
                    Id = c.Id,
                    ParentId = c.ParentId,
                    ReviewId = c.ReviewId,
                    Comment = c.IsDeleted ? null : c.Message,
                    CommenterId = c.IsDeleted ? null : c.CommenterId,
                    CommenterName = c.IsDeleted ? null : c.CommenterName,
                    CommentedAt = c.IsDeleted ? null : c.CommentedAt,
                    IsDeleted = c.IsDeleted,
                    Children = GetCommentChildren(c.Id, allComments, 0, 0),
                    TotalChildren = allComments.Count(child => child.ParentId == c.Id)
                })
                .ToList();

            return children;
        }

        [HttpGet("[action]/{commentId}/{offset}")]
        public async Task<IActionResult> GetCommentsRemainingChildren(int commentId, int offset)
        {
            var comments = await _databaseContext.Comments
                .Where(c => c.ParentId == commentId)
                .OrderByDescending(c => c.CommentedAt)
                .Skip(offset)
                .Select(c => new CommentModel
                {
                    Id = c.Id,
                    ParentId = c.ParentId,
                    ReviewId = c.ReviewId,
                    Comment = c.IsDeleted ? null : c.Message,
                    CommenterId = c.IsDeleted ? null : c.CommenterId,
                    CommenterName = c.IsDeleted ? null : c.CommenterName,
                    CommentedAt = c.IsDeleted ? null : c.CommentedAt,
                    IsDeleted = c.IsDeleted,
                    Children = GetCommentChildren(c.Id, c.Children, 0, 0),
                    TotalChildren = c.Children.Count
                })
                .ToListAsync();

            return Ok(comments);
        }

        [HttpDelete("[action]/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _databaseContext.Comments.SingleOrDefaultAsync(c => c.Id == commentId);

            if (comment == null)
                return NotFound(new { Message = "Comment Not Found" });

            comment.IsDeleted = true;

            _databaseContext.Comments.Update(comment);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Comment Deleted" });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostComment([FromBody] CommentModel commentModel)
        {
            var comment = new Comment
            {
                ReviewId = commentModel.ReviewId,
                ParentId = commentModel.ParentId,
                Message = commentModel.Comment,
                CommenterId = commentModel.CommenterId,
                CommenterName = commentModel.CommenterName,
                CommentedAt = _dateTimeProviderHelper.UtcNow,
                IsDeleted = false
            };

            await _databaseContext.Comments.AddAsync(comment);
            await _databaseContext.SaveChangesAsync();

            return Ok(await GetComment(comment.Id));
        }

        private async Task<CommentModel> GetComment(int commentId)
        {
            var comment = await _databaseContext.Comments
                .Include(c => c.Children)
                .SingleAsync(c => c.Id == commentId);

            return new CommentModel
            {
                Id = comment.Id,
                ParentId = comment.ParentId,
                ReviewId = comment.ReviewId,
                Comment = comment.IsDeleted ? null : comment.Message,
                CommenterId = comment.IsDeleted ? null : comment.CommenterId,
                CommenterName = comment.IsDeleted ? null : comment.CommenterName,
                CommentedAt = comment.IsDeleted ? null : comment.CommentedAt,
                Children = GetCommentChildren(comment.Id, comment.Children, 0, 0),
                TotalChildren = comment.Children.Count,
                IsDeleted = comment.IsDeleted
            };
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentModel updateCommentModel)
        {
            var comment = await _databaseContext.Comments.SingleOrDefaultAsync(c => c.Id == updateCommentModel.Id);

            if (comment == null)
                return NotFound(new { Message = "Comment Not Found" });

            comment.Message = updateCommentModel.Message;
            comment.CommentedAt = _dateTimeProviderHelper.UtcNow;

            _databaseContext.Comments.Update(comment);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Comment Updated" });
        }
    }
}
