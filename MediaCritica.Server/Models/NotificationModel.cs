namespace MediaCritica.Server.Models
{
    public class NotificationModel
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class NewNotificationModel
    {
        public int AuthorId { get; set; }
        public string ReviewTitle { get; set; }
    }
}
