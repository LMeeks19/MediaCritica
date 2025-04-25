namespace MediaCritica.Server.Models
{
    public class UserFollowSummaryModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string FollowedOn { get; set; }
    }
}
