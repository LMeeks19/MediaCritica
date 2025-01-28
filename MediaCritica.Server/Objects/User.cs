namespace MediaCritica.Server.Objects
{
    public class User
    {
        public int Id { get; set; }
        public required string Forename { get; set; }
        public required string Surname { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required DateTime Joined { get; set; }
        public virtual Preference Preference { get; set; }
        public virtual List<Backlog> Backlogs { get; set; }
        public virtual List<Review> Reviews { get; set; }
        public virtual List<Milestone> Milestones { get; set; }
        public virtual List<Engagement> Engagements { get; set; }
        public virtual List<UserFollow> Followers { get; set; }
        public virtual List<UserFollow> Following { get; set; }
        public virtual List<Notification> Notifications { get; set; }

    }
}
