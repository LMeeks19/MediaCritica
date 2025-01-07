using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Objects
{
    public class Milestone
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public MilestoneType MilestoneType { get; set; }
        public MilestoneLevel EarnedLevel { get; set; }
        public DateTime? EarnedDate { get; set; }
    }
}
