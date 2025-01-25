namespace MediaCritica.Server.Objects
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Recipient
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
