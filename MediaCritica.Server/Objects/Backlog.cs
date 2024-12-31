using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Backlog
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public virtual User User { get; set; }

        public string MediaId { get; set; }
        public string MediaType { get; set; }
        public string MediaPoster { get; set; }
        public string MediaTitle { get; set; }

        public BacklogCategoryType Category { get; set; }
        public DateTime AddedDate { get; set; }
    }
}
