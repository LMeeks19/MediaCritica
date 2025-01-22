namespace MediaCritica.Server.Models
{
    public class UserFollowModel
    {
        public int Id { get; set; }
        public int FollowerId { get; set; }
        public int FollowedId { get; set; }
        public DateTime FollowedOn { get; set; }
        public bool EnabledNotifications { get; set; }
    }
}

