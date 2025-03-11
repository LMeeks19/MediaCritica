namespace MediaCritica.Server.Hubs
{
    public class Hubs(NotificationHub notificationHub) : IHubs
    {
        public NotificationHub NotificationHub { get; set; } = notificationHub;

    }
}
