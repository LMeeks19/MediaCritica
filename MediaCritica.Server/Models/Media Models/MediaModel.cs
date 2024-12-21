namespace MediaCritica.Server.Models
{
    public class MediaModel
    {
        public required string Actors { get; set; }
        public required string Awards { get; set; }
        public required string Country { get; set; }
        public required string Director { get; set; }
        public required string Genre { get; set; }
        public required string Language { get; set; }
        public required string Metascore { get; set; }
        public required string Plot { get; set; }
        public required string Poster { get; set; }
        public required string Rated { get; set; }
        public required List<RatingModel> Ratings { get; set; }
        public required string Released { get; set; }
        public required string Runtime { get; set; }
        public required string Title { get; set; }
        public required string Type { get; set; }
        public required string Writer { get; set; }
        public required string Year { get; set; }
        public required string imdbID { get; set; }
        public required string imdbRating { get; set; }
        public required string imdbVotes { get; set; }

        public List<ReviewSummaryModel> Reviews { get; set; } = [];
    }

    public class RatingModel
    {
        public string Source { get; set; }
        public string Value { get; set; }
    }
}
