namespace MediaCritica.Server.Models
{
    public class ReviewSummaryModel
    {
        public int Id { get; set; }
        public string ReviewerUsername { get; set; }
        public string MediaType { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public string Date { get; set; }
    }
}
