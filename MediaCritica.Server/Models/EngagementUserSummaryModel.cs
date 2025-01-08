using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models
{
    public class EngagementUserSummaryModel
    {
        public int Id { get; set; }
        public int ReviewId { get; set; }
        public EngagementType Type { get; set; }
    }
}
