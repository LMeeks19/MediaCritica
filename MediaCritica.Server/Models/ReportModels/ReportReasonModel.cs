using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportReasonModel
    {
        public string Reason { get; set; }
        public List<ReportModel> Reports { get; set; }
        public int TotalReports => Reports.Count;
        public int TotalApprovedReports => Reports.Count(report => report.Status == ReportStatus.APPROVED);
        public int TotalRejectedReports => Reports.Count(report => report.Status == ReportStatus.REJECTED);
        public int TotalPendingReports => Reports.Count(report => report.Status == ReportStatus.PENDING);
    }
}
