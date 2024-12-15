namespace MediaCritica.Server.Objects
{
    public class Backlog
    {
        public int Id { get; set; }
        public required int UserId { get; set; }
        public virtual User User { get; set; }
        public required string MediaId { get; set; }
        public required string MediaType {  get; set; } 
        public required string MediaPoster { get; set; }
        public required string MediaTitle { get; set; }
    }
}
