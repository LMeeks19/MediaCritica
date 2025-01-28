using MediaCritica.Server.Hubs;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController(DatabaseContext databaseContext, IHubContext<NotificationHub> notificationHubContext, NotificationHub notificationHub) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHubContext<NotificationHub> _notificationHubContext = notificationHubContext;
        private readonly NotificationHub _notificationHub = notificationHub;

        // Get notifications for a specific user
        [HttpGet("[action]/{userId}/{offset}/{limit}")]
        public async Task<IActionResult> GetUserNotifications(int userId, int offset, int limit = 25)
        {
            var notifications = await _databaseContext.Notifications
                .Where(n => n.RecipientId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(notification => new NotificationModel()
                {
                    Id = notification.Id,
                    AuthorName = notification.AuthorName,
                    Message = notification.Message,
                    IsRead = notification.IsRead,
                    IsBookmarked = notification.IsBookmarked,
                    CreatedAt = notification.CreatedAt,
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // Mark a single notification as read
        [HttpPut("[action]/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var updatedCount = await _databaseContext.Notifications
                .Where(n => n.Id == notificationId)
                .ExecuteUpdateAsync(n => n.SetProperty(notification => notification.IsRead, true));

            if (updatedCount == 0)
                return NoContent();

            return Ok();
        }

        // Mark all notifications as read for a user
        [HttpPut("[action]/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(int userId)
        {
            var unreadNotificationsExist = await _databaseContext.Notifications
                .AnyAsync(n => n.RecipientId == userId && !n.IsRead);

            if (!unreadNotificationsExist)
                return NoContent();

            await _databaseContext.Notifications
                .Where(n => n.RecipientId == userId && !n.IsRead)
                .ExecuteUpdateAsync(n => n.SetProperty(notification => notification.IsRead, true));

            await _databaseContext.SaveChangesAsync();
            return Ok();
        }

        // update bookmark status of a notification
        [HttpPut("[action]/{notificationId}")]
        public async Task<IActionResult> UpdateBookmarkStatus(int notificationId)
        {
            var notification = await _databaseContext.Notifications
                .Where(n => n.Id == notificationId)
                .SingleOrDefaultAsync();

            if (notification == null)
                return NotFound();

            notification.IsBookmarked = !notification.IsBookmarked;

            if (!notification.IsBookmarked && DateTime.Now > notification.CreatedAt.AddMonths(1))
                _databaseContext.Notifications.Remove(notification);

            await _databaseContext.SaveChangesAsync();
            return Ok();
        }

        // delete a notification
        [HttpDelete("[action]/{notificationId}")]
        public async Task<IActionResult> Delete(int notificationId)
        {
            var deletedCount = await _databaseContext.Notifications
                .Where(n => n.Id == notificationId)
                .ExecuteDeleteAsync();

            if (deletedCount == 0)
                return NotFound();

            return Ok();
        }

        // Notify followers about a new review
        public async Task<IActionResult> NotifyFollowers(NewNotificationModel newNotificationModel)
        {
            var notifications = await _databaseContext.UserFollows
                .Where(f => f.FollowedId == newNotificationModel.AuthorId && f.EnabledNotifications)
                .Select(f => new Notification()
                {
                    RecipientId = f.FollowerId,
                    AuthorName = newNotificationModel.AuthorName,
                    Message = newNotificationModel.Message,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                })
                .ToListAsync();

            if (notifications.Count == 0)
                return NoContent();

            await _databaseContext.Notifications.AddRangeAsync(notifications);

            var connectionIds = notifications.Select(n => _notificationHub.GetUserConnecion(n.RecipientId)).Where(id => id != null).ToList();
            if (connectionIds.Count != 0)
                await _notificationHubContext.Clients.Clients(connectionIds).SendAsync("ReceiveNotification", new { newNotificationModel.AuthorName, newNotificationModel.Message, });

            await _databaseContext.SaveChangesAsync();

            return Ok();
        }
    }
}
