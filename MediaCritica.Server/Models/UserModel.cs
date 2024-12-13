namespace MediaCritica.Server.Models
{
    public class UserModel
    {
        public int? Id { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public List<BacklogSummaryModel> BacklogSummary { get; set; } = [];
        public required int TotalReviews { get; set; }
        public required int TotalBacklogs { get; set; }
    }
}
