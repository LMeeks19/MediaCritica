namespace MediaCritica.Server.Models
{
    public class ReviewsModel
    {
        public List<ReviewModel> MovieReviews { get; set; }
        public List<ReviewModel> SeriesReviews { get; set; }
        public List<ReviewModel> GameReviews { get; set; }
        public List<ReviewModel> EpisodeReviews { get; set; }
    }
}
