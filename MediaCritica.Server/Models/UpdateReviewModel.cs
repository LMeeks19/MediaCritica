namespace MediaCritica.Server.Models
{
    public class UpdateReviewModel
    {
        public int ReviewId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double Rating { get; set; }
        public DateTime Date { get; set; }
    }
}
