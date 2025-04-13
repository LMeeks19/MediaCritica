namespace MediaCritica.Server.Models
{
    public class UserFollowSummaryModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public DateTime FollowedOn { get; set; }
    }
}
