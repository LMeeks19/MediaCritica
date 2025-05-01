using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models
{
    public class MilestoneModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public MilestoneType Type { get; set; }
        public string Category { get; set; }
        public MilestoneLevel EarnedLevel { get; set; }
        public ProgressModel Progress { get; set; }
        public string? EarnedDate { get; set; }
    }

    public class ProgressModel
    {
        public double Current { get; set; }
        public double Target { get; set; }
        public double Percentage { get; set; }
    }

}
