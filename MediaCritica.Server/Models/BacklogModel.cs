using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models
{
    public class BacklogModel
    {
        public int Id { get; set; }
        public string MediaId { get; set; }
        public string MediaType { get; set; }
        public string? MediaPoster { get; set; }
        public string MediaTitle { get; set; }
        public BacklogCategoryType Category { get; set; }
        public string AddedDate { get; set; }
    }
}
