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

            var reports = await _databaseContext.Reports
                .Include(r => r.Review)
                .Where(r => r.ReviewId != null)
                .GroupBy(x => x.ReviewId)
                .Select(r => new ReportModelObject
                {
                    ReviewId = r.Key,
                    ReviewTitle = r.First().Review!.Title,
                    ReportedId = r.First().Review!.UserId,
                    ReportedUsername = r.First().Review!.User.Username,
                    ReportReasons = r.GroupBy(report => report.Reason)
                        .OrderByDescending(g => g.Count())
                        .Select(g => new ReportReasonModel
                        {
                            Reason = GetReasonString((ReportReason)r.Key!),
                            Reports = g.OrderByDescending(r => r.ReportedAt)
                                .ThenByDescending(r => r.Status)
                                .Select(report => _mapper.ReportMapper.MapReportModeL(report, preference, _dateTimeProviderHelper))
                                .ToList()
                        })
                        .ToList()
                }).ToListAsync();

            return Ok(reports);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetCommentReports()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var preference = await _helper.InternalApiHelper.GetUserPreference(userId);

            var reports = await _databaseContext.Reports
                .Include(r => r.Comment)
                    .ThenInclude(c => c.Commenter)
                .Where(r => r.CommentId != null)
                .GroupBy(x => x.CommentId)
                .Select(r => new ReportModelObject
                {
                    CommentId = r.Key,
                    CommentContent = r.First().Comment!.Content,
                    ReportedId = (int)r.First().Comment!.CommenterId!,
                    ReportedUsername = r.First().Comment!.Commenter.Username,
                    ReportReasons = r.GroupBy(report => report.Reason)
                        .OrderByDescending(g => g.Count())
                        .Select(g => new ReportReasonModel
                        {
                            Reason = GetReasonString((ReportReason)r.Key!),
                            Reports = g.OrderByDescending(r => r.ReportedAt)
                                .ThenByDescending(r => r.Status)
                                .Select(report => _mapper.ReportMapper.MapReportModeL(report, preference, _dateTimeProviderHelper))
                                .ToList()
                        })
                        .ToList()
                }).ToListAsync();

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
