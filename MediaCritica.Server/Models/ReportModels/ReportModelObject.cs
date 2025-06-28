namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportModelObject
    {
        public int Id { get; set; }
        public int ReviewId { get; set; }
        public int? CommentId { get; set; }
        public string MediaId { get; set; }
        public string MediaType { get; set; }
        public string ReportedUsername { get; set; }
        public string? ReviewTitle { get; set; }
        public string? CommentContent { get; set; }
        public List<ReportReasonModel> ReportReasons { get; set; } = [];
    }
}
