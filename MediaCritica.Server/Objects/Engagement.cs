using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Engagement
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ReviewId { get; set; }
        public EngagementType Type { get; set; }
    }
}
