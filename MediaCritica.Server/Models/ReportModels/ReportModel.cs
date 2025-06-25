using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportModel
    {
        public int Id { get; set; }
        public int? ReviewId { get; set; }
        public int? CommentId { get; set; }
        public int ReporterId { get; set; }
        public string ReporterUsername { get; set; } = string.Empty;
        public ReportReason Reason { get; set; }
        public string? Details { get; set; }
        public string ReportedAt { get; set; }
        public ReportStatus Status { get; set; }
    }
}
