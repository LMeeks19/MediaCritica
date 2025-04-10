namespace MediaCritica.Server.Objects
{
    public class Notification
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public virtual User Recipient { get; set; }
        public string AuthorUsername { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public bool IsBookmarked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
