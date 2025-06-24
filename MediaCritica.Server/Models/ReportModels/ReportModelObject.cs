using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportModelObject
    {
        public int ReportedId { get; set; }
        public string ReportedUsername { get; set; } = string.Empty;


        public int? ReviewId { get; set; }
        public string? ReviewTitle { get; set; }


        public int? CommentId { get; set; }
        public string? CommentContent { get; set; }


        public List<ReportReasonModel> ReportReasons { get; set; } = [];
        public int TotalReports => ReportReasons.Sum(r => r.Reports.Count);
        public int TotalApprovedReports => ReportReasons.Sum(r => r.Reports.Count(report => report.Status == ReportStatus.APPROVED));
        public int TotalRejectedReports => ReportReasons.Sum(r => r.Reports.Count(report => report.Status == ReportStatus.REJECTED));
        public int TotalPendingReports => ReportReasons.Sum(r => r.Reports.Count(report => report.Status == ReportStatus.PENDING));
    }
}
