namespace MediaCritica.Server.Models
{
    public class UserFollowSummaryModel
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public DateTime FollowedOn { get; set; }
    }
}
