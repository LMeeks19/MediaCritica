namespace MediaCritica.Server.Models
{
    public class ReviewModel
    {
        public required string MediaId { get; set; }
        public required string MediaPoster { get; set; }
        public required string MediaTitle { get; set; }
        public required string MediaType { get; set; }
        public int? MediaSeason { get; set; }
        public int? MediaEpisode { get; set; }
        public string? MediaParentId { get; set; }
        public string? MediaParentTitle { get; set; }
        public required string ReviewerEmail { get; set; }
        public required double Rating { get; set; }
        public required string Description { get; set; }
        public required DateTime Date { get; set; }
    }
}
