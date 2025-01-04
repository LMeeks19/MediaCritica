namespace MediaCritica.Server.Objects
{
    public class Media
    {
        public string Id { get; set; }
        public string? Actors { get; set; }
        public string? Awards { get; set; }
        public string? Countries { get; set; }
        public string? Directors { get; set; }
        public string? Genres { get; set; }
        public string? Languages { get; set; }
        public int? Metascore { get; set; }
        public string? Plot { get; set; }
        public string? Poster { get; set; }
        public string? Rated { get; set; }
        public virtual List<Rating>? Ratings { get; set; }
        public DateTime Released { get; set; }
        public string? Runtime { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string? Writers { get; set; }
        public string? Year { get; set; }
        public double? ImdbRating { get; set; }
        public int? ImdbVotes { get; set; }
        public virtual List<Review> Reviews { get; set; }
        public virtual List<Backlog> Backlogs { get; set; }
    }

    public class Rating
    {
        public int Id { get; set; }
        public string MediaId { get; set; }
        public string Source { get; set; }
        public string Value { get; set; }
    }
}
