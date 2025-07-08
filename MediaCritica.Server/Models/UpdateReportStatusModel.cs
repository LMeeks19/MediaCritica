namespace MediaCritica.Server.Models
{
    public class UpdateReportStatusModel
    {
        public int? ReviewId { get; set; }
        public int? CommentId { get; set; }
        public ReportAction Action { get; set; }
    }

    public enum ReportAction
    {
        Approve,
        Reject
    }
}
