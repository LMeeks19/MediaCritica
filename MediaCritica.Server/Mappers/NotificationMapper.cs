using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class NotificationMapper
    {
        public Notification MapNotification(NewNotificationModel newNotificationModel, int followerId, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new Notification
            {
                AuthorId = newNotificationModel.AuthorId,
                RecipientId = followerId,
                Message = newNotificationModel.Message,
                IsRead = false,
                IsBookmarked = false,
                CreatedAt = dateTimeProviderHelper.UtcNow
            };
        }

        public NotificationModel MapNotificationModel(Notification notification, string timezone, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new NotificationModel
            {
                Id = notification.Id,
                AuthorUsername = notification.Author.Username,
                Message = notification.Message,
                IsRead = notification.IsRead,
                IsBookmarked = notification.IsBookmarked,
                CreatedAt = dateTimeProviderHelper.GetLocalDateTime(notification.CreatedAt, timezone)
            };
        }
    }
}
