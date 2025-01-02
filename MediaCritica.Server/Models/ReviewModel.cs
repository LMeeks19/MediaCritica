namespace MediaCritica.Server.Models
{
    public class ReviewModel
    {
        public int Id { get; set; }
        public string MediaId { get; set; }
        public string MediaPoster { get; set; }
        public string MediaTitle { get; set; }
        public string MediaType { get; set; }
        public string ReviewerName { get; set; }
        public int ReviewerId { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}
