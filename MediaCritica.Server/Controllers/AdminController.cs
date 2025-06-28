using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
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
                .Select((review, index) => new ReportModelObject
                {
                    Id = index,
                    ReviewId = review.Id,
                    ReviewTitle = review.Title,
                    MediaId = review.MediaId,
                    MediaType = review.MediaType,
                    ReportedUsername = review.User.Username,
                    ReportReasons = [.. review.Reports.GroupBy(report => report.Reason)
                        .Select((group, index) => new ReportReasonModel
                        {
                            Id = index,
                            Reason = GetReasonString(group.Key),
                            Reports = [.. group.OrderByDescending(report => report.ReportedAt).Select(report => _mapper.ReportMapper.MapReportModeL(report, preference, _dateTimeProviderHelper))]
                        })]
                }).ToList();

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
                        .Select((group, index) => new ReportReasonModel
                        {
                            Id = index,
                            Reason = GetReasonString(group.Key),
                            Reports = [.. group.OrderByDescending(report => report.ReportedAt).Select(report => _mapper.ReportMapper.MapReportModeL(report, preference, _dateTimeProviderHelper))]
                        })]
                }).ToList();

            return Ok(reports);
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
