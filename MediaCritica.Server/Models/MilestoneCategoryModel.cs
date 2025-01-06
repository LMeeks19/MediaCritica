namespace MediaCritica.Server.Models
{
    public class MilestoneCategoryModel
    {
        public string Category { get; set; }
        public List<MilestoneModel> Milestones { get; set; } = [];
    }
}
