namespace MediaCritica.Server.Models
{
    public class ReviewSummaryModel
    {
        public int Id { get; set; }
        public string ReviewerName { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public DateTime Date { get; set; }
    }
}
