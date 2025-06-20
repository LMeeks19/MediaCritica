namespace MediaCritica.Server.Objects
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Joined { get; set; }
        public bool IsAdmin { get; set; }
        public virtual Preference Preference { get; set; }
        public virtual List<Backlog> Backlogs { get; set; }
        public virtual List<Review> Reviews { get; set; }
        public virtual List<Milestone> Milestones { get; set; }
        public virtual List<Engagement> Engagements { get; set; }
        public virtual List<UserFollow> Followers { get; set; }
        public virtual List<UserFollow> Following { get; set; }
        public virtual List<Notification> Notifications { get; set; }
        public virtual string FullName => $"{Forename} {Surname}";

    }
}
