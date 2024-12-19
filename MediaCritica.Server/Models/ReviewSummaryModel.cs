namespace MediaCritica.Server.Models
{
    public class ReviewSummaryModel
    {
        public required int Id { get; set; }
        public required string ReviewerName { get; set; }
        public required string Title { get; set; }
        public required double Rating { get; set; }
        public required DateTime Date { get; set; }
    }
}
