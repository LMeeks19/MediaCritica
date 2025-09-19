using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Review
    {
        public int Id { get; set; }

        public string MediaId { get; set; }
        public string MediaPoster { get; set; }
        public string MediaTitle { get; set; }
        public string? MediaSeriesTitle { get; set; }
        public string MediaType { get; set; }

        public int UserId { get; set; }
        public double Rating { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public ContentStatus Status { get; set; } = ContentStatus.Active;


        public virtual Media Media { get; set; }
        public virtual User User { get; set; }
        public virtual List<Engagement> Engagements { get; set; }
        public virtual List<Comment> Comments { get; set; }
        public virtual List<Report> Reports { get; set; }

    }
}
