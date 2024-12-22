
namespace MediaCritica.Server.Models
{
    public class MediaSearchModel
    {
        public Uri? Poster { get; set; }
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required string Year { get; set; }
        public required string imdbID { get; set; }
    }
}
