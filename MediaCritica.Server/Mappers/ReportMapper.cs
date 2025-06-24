using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class ReportMapper
    {
        public Report MapReport(ReportModel reportModel, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new Report
            {
                CommentId = reportModel.CommentId,
                ReviewId = reportModel.ReviewId,
                ReporterId = reportModel.ReporterId,
                Reason = reportModel.Reason,
                Details = reportModel.Details,
                ReportedAt = dateTimeProviderHelper.UtcNow,
                Status = ReportStatus.PENDING
            };
        }

        public ReportModel MapReportModeL(Report report, PreferenceModel preference, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new ReportModel()
            {
                Id = report.Id,
                ReviewId = report.ReviewId,
                CommentId = report.CommentId,
                ReporterId = report.ReporterId,
                Reason = report.Reason,
                Details = report.Details,
                ReportedAt = dateTimeProviderHelper.GetLocalDate(report.ReportedAt, preference),
                Status = report.Status,
            };
        }
    }
}
