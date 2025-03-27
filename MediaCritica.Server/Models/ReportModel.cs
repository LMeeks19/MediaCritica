using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models
{
    public class ReportModel
    {
        public int Id { get; set; }
        public int? ReviewId { get; set; }
        public int? CommentId { get; set; }
        public int ReporterId { get; set; }
        public ReportReason Reason { get; set; }
        public string? Details { get; set; }
        public DateTime ReportedAt { get; set; }
    }
}
