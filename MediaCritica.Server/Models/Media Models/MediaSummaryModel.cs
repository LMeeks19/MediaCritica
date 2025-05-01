namespace MediaCritica.Server.Models.Media_Models
{
    public class MediaSummaryModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string? Poster { get; set; }
        public string Genre { get; set; }
        public string? Released { get; set; }
        public double? ImdbRating { get; set; }
        public string ImdbId { get; set; }

    }
}
