using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Report
    {
        public int Id { get; set; }
        public int? ReviewId { get; set; }
        public int? CommentId { get; set; }
        public int ReporterId { get; set; }
        public ReportReason Reason { get; set; }
        public string? Details { get; set; }
        public DateTime ReportedAt { get; set; }

        public virtual Review? Review { get; set; }
        public virtual Comment? Comment { get; set; }
        public virtual User Reporter { get; set; }
    }
}
