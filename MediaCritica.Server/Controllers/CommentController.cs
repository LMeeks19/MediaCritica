using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController(DatabaseContext databaseContext, IMappers mapper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpGet("[action]/{reviewId}")]
        public async Task<IActionResult> GetReviewComments(int reviewId)
        {
            if (!_databaseContext.Reviews.Any(r => r.Id == reviewId))
                return NotFound(new { Message = "Review Not Found" });

            var comments = await _databaseContext.Comments
                .Include(c => c.Reports)
                .Where(c => c.ReviewId == reviewId)
                .Where(c => !c.IsDeleted || (c.IsDeleted && c.Replies.Count > 0 && c.Replies.Any(c => !c.IsDeleted)))
                .OrderByDescending(c => c.CommentedAt)
                .ToListAsync();

            var rootComments = comments
                .Where(c => c.ParentId == null)
                .Select(c => _mapper.CommentMapper.MapCommentModel(c, GetReplies(c.Id, comments), comments.Count(child => child.ParentId == c.Id)))
                .ToList();

            return Ok(rootComments);
        }

        private List<CommentModel> GetReplies(int parentId, List<Comment> comments)
        {
            var children = comments
                .Where(c => c.ParentId == parentId)
                .Where(c => !c.IsDeleted || (c.IsDeleted && c.Replies.Count > 0 && c.Replies.Any(c => !c.IsDeleted)))
                .OrderByDescending(c => c.CommentedAt)
                .Take(2)
                .Select(c => _mapper.CommentMapper.MapCommentModel(c, GetReplies(c.Id, comments), comments.Count(child => child.ParentId == c.Id)))
                .ToList();

            return children;
        }

        [HttpGet("[action]/{commentId}/{offset}")]
        public async Task<IActionResult> GetCommentsRemainingChildren(int commentId, int offset)
        {
            var comments = await _databaseContext.Comments
                .Include(c => c.Reports)
                .Where(c => c.ParentId == commentId)
                .OrderByDescending(c => c.CommentedAt)
                .Skip(offset)
                .Select(c => _mapper.CommentMapper.MapCommentModel(c, GetReplies(c.Id, c.Replies), c.Replies.Count))
                .ToListAsync();

            return Ok(comments);
        }

        [HttpDelete("[action]/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _databaseContext.Comments
                .SingleOrDefaultAsync(c => c.Id == commentId && !c.IsDeleted);

            if (comment == null)
                return NotFound(new { Message = "Comment Not Found" });

            comment.IsDeleted = true;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Comment Deleted" });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostComment([FromBody] CommentModel commentModel)
        {
            var comment = _mapper.CommentMapper.MapComment(commentModel, _dateTimeProviderHelper);

            if (comment.ParentId != null && !_databaseContext.Comments.Any(c => c.Id == comment.ParentId))
                return NotFound(new { Message = "Parent Comment Not Found" });
            if (_databaseContext.Comments.Any(c => c.Id == comment.ParentId && c.IsDeleted))
                return Conflict(new { Message = "Cannot reply to a deleted comment" });

            await _databaseContext.Comments.AddAsync(comment);
            await _databaseContext.SaveChangesAsync();

            return Ok(await GetComment(comment.Id));
        }

        private async Task<CommentModel> GetComment(int commentId)
        {
            var comment = await _databaseContext.Comments
                .Include(c => c.Reports)
                .Include(c => c.Replies)
                .SingleAsync(c => c.Id == commentId);

            return _mapper.CommentMapper.MapCommentModel(comment, GetReplies(comment.Id, comment.Replies), comment.Replies.Count);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateComment([FromBody] UpdateCommentModel updateCommentModel)
        {
            var comment = await _databaseContext.Comments
                .SingleOrDefaultAsync(c => c.Id == updateCommentModel.Id && !c.IsDeleted);

            if (comment == null)
                return NotFound(new { Message = "Comment Not Found" });

            comment.Content = updateCommentModel.Content;
            comment.CommentedAt = _dateTimeProviderHelper.UtcNow;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Comment Updated" });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReportComment([FromBody] ReportModel reportModel)
        {
            if (_databaseContext.Reports.Any(r => r.ReporterId == reportModel.ReporterId && r.CommentId == reportModel.CommentId))
                return Conflict(new { Message = "Comment Already Reported" });

            var comment = await _databaseContext.Comments
                .Include(c => c.Reports)
                .FirstOrDefaultAsync(c => c.Id == reportModel.CommentId && !c.IsDeleted);
            if (comment == null)
                return NotFound(new { Message = "Comment Not Found" });

            if (!_databaseContext.Users.Any(u => u.Id == reportModel.ReporterId))
                return NotFound(new { Message = "User Not Found" });

            var report = new Report
            {
                CommentId = reportModel.CommentId,
                ReporterId = reportModel.ReporterId,
                Reason = reportModel.Reason,
                Details = reportModel.Details,
                ReportedAt = _dateTimeProviderHelper.UtcNow,
            };

            await _databaseContext.Reports.AddAsync(report);

            if (comment.Reports.Count >= 5)
                comment.IsDeleted = true;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Comment Reported" });
        }
    }
}
