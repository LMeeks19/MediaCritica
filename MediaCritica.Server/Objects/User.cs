namespace MediaCritica.Server.Objects
{
    public class User
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public virtual List<Backlog> Backlogs { get; set; } = [];
        public virtual List<Review> Reviews { get; set; } = [];
    }
}
