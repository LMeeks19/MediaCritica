namespace MediaCritica.Server.Models
{
    public class ReviewModel
    {
        public int Id { get; set; }
        public string MediaId { get; set; }
        public string MediaPoster { get; set; }
        public string MediaTitle { get; set; }
        public string? MediaSeriesId { get; set; }
        public string? MediaSeriesTitle { get; set; }
        public string? MediaEpisode { get; set; }
        public string MediaType { get; set; }
        public string ReviewerUsername { get; set; }
        public int ReviewerId { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public int TotalComments { get; set; }
    }
}
