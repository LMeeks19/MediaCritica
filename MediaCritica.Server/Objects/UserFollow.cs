namespace MediaCritica.Server.Objects
{
    public class UserFollow
    {
        public int Id { get; set; }

        // The user who is following another user
        public int FollowerId { get; set; }
        public virtual User Follower { get; set; }

        // The user being followed
        public int FollowedId { get; set; }
        public virtual User Followed { get; set; }

        public DateTime FollowedOn { get; set; }
        public bool EnabledNotifications { get; set; }
    }
}
