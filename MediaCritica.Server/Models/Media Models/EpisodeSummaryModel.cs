namespace MediaCritica.Server.Models
{
    public class EpisodeSummaryModel
    {
        public string Id { get; set; }
        public string Episode { get; set; }
        public string? Released { get; set; }
        public string Title { get; set; }
        public string imdbID { get; set; }
        public string imdbRating { get; set; }
    }
}
