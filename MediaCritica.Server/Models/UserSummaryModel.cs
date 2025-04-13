namespace MediaCritica.Server.Models
{
    public class UserSummaryModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public DateOnly Joined { get; set; }
        public double ReviewsWritten { get; set; }
        public double MediaBacklogged { get; set; }
        public double Followers { get; set; }
        public double Following { get; set; }
        public double EngagementsReceivedLikes { get; set; }
        public double EngagementsReceivedDislikes { get; set; }
        public double EngagementsGivenLikes { get; set; }
        public double EngagementsGivenDislikes { get; set; }
        public double MilestonesEarned { get; set; }
        public List<ReviewModel> Reviews { get; set; } = [];
        public List<MilestoneModel> Milestones { get; set; } = [];
        public List<double> Breakdown { get; set; } = [];
    }
}
