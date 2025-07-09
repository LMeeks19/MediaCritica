using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Models.ReportModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;

        [HttpGet("[action]")]
        public async Task<IActionResult> GetReviewReports()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var preference = await _helper.InternalApiHelper.GetUserPreference(userId);

            var reports = _databaseContext.Reviews
                .Include(review => review.User)
                .Include(review => review.Reports)
                    .ThenInclude(report => report.Reporter)
                .Where(review => review.Status == ContentStatus.UnderReview)
                .AsEnumerable()
                .Take(20)
                .Select((review, index) => new ReportModelObject
                {
                    Id = index,
                    ReviewId = review.Id,
                    ReviewTitle = review.Title,
                    MediaId = review.MediaId,
                    MediaType = review.MediaType,
                    ReportedUsername = review.User.Username,
                    ReportReasons = [.. review.Reports.GroupBy(report => report.Reason)
                        .Select(group => new ReportReasonModel
                        {
                            ReasonId = (int)group.Key,
                            ReasonText = GetReasonString(group.Key),
                            Reports = [.. group.OrderByDescending(report => report.ReportedAt).Take(5).Select(report => _mapper.ReportMapper.MapReportModel(report, preference, _dateTimeProviderHelper))],
                            TotalReports = group.Count()
                        })]
                }).ToList();

            return Ok(reports);
        }

        [HttpGet("[action]/{reviewId}/{reason}/{offset}")]
        public async Task<IActionResult> GetMoreReviewReports(int reviewId, ReportReason reason, int offset)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var preference = await _helper.InternalApiHelper.GetUserPreference(userId);

            var reports = await _databaseContext.Reports
                .Include(report => report.Reporter)
                .Where(r => r.ReviewId == reviewId && r.Reason == reason)
                .OrderByDescending(r => r.ReportedAt)
                .Skip(offset)
                .Take(5)
                .Select(r => _mapper.ReportMapper.MapReportModel(r, preference, _dateTimeProviderHelper))
                .ToListAsync();

            return Ok(reports);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetCommentReports()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var preference = await _helper.InternalApiHelper.GetUserPreference(userId);

            var reports = _databaseContext.Comments
                .Include(comment => comment.Review)
                .Include(comment => comment.Commenter)
                .Include(comment => comment.Reports)
                    .ThenInclude(report => report.Reporter)
                .Where(comment => comment.Status == ContentStatus.UnderReview)
                .AsEnumerable()
                .Take(20)
                .Select((comment, index) => new ReportModelObject
                {
                    Id = index,
                    ReviewId = comment.ReviewId,
                    CommentId = comment.Id,
                    MediaType = comment.Review.MediaType,
                    MediaId = comment.Review.MediaId,
                    CommentContent = comment.Content,
                    ReportedUsername = comment.Commenter.Username,
                    ReportReasons = [.. comment.Reports.GroupBy(report => report.Reason)
                        .Select(group => new ReportReasonModel
                        {
                            ReasonId = (int)group.Key,
                            ReasonText = GetReasonString(group.Key),
                            Reports = [.. group.OrderByDescending(report => report.ReportedAt).Take(5).Select(report => _mapper.ReportMapper.MapReportModel(report, preference, _dateTimeProviderHelper))],
                            TotalReports = group.Count(),
                        })]
                }).ToList();

            return Ok(reports);
        }

        [HttpGet("[action]/{commentId}/{reason}/{offset}")]
        public async Task<IActionResult> GetMoreCommentReports(int commentId, ReportReason reason, int offset)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var preference = await _helper.InternalApiHelper.GetUserPreference(userId);

            var reports = await _databaseContext.Reports
                .Include(report => report.Reporter)
                .Where(r => r.CommentId == commentId && r.Reason == reason)
                .OrderByDescending(r => r.ReportedAt)
                .Skip(offset)
                .Take(5)
                .Select(r => _mapper.ReportMapper.MapReportModel(r, preference, _dateTimeProviderHelper))
                .ToListAsync();

            return Ok(reports);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateReportStatus([FromBody] UpdateReportStatusModel updateReportStatusModel)
        {
            var review = await _databaseContext.Reviews
                .FirstOrDefaultAsync(r => r.Id == updateReportStatusModel.ReviewId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });
            else
                review.Status = updateReportStatusModel.Action == ReportAction.Approve ? ContentStatus.Removed : ContentStatus.Active;

            var comment = await _databaseContext.Comments
                .FirstOrDefaultAsync(c => c.Id == updateReportStatusModel.CommentId);

            if (comment == null)
                return NotFound(new { Message = "Comment not found" });
            else
                comment.Status = updateReportStatusModel.Action == ReportAction.Approve ? ContentStatus.Removed : ContentStatus.Active;

            await _databaseContext.SaveChangesAsync();

            var message = $"{(review == null ? "Comment" : "Review")} {(updateReportStatusModel.Action == ReportAction.Approve ? "Removed" : "Reinstated")}";

            return Ok(new { Message = message });
        }

        private static string GetReasonString(ReportReason reason)
        {
            return reason switch
            {
                ReportReason.Spam => "Spam",
                ReportReason.Harassment => "Harassment",
                ReportReason.Hate => "Hate",
                ReportReason.Language => "Language",
                ReportReason.Misinformation => "Misinformation",
                ReportReason.Privacy => "Privacy",
                ReportReason.Violence => "Violence",
                ReportReason.Abuse => "Abuse",
                _ => "Unknown"
            };
        }
    }
}
