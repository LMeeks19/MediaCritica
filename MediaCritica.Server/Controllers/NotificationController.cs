using MediaCritica.Server.Helpers;
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
    public class NotificationController(DatabaseContext databaseContext, IHelpers helper, IHubContext<NotificationHub> notificationHubContext, IHubs hubs) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHelpers _helper = helper;
        private readonly IHubContext<NotificationHub> _notificationHubContext = notificationHubContext;
        private readonly IHubs _hubs = hubs;

        [HttpGet("[action]/{offset}/{limit}")]
        public async Task<IActionResult> GetUserNotifications(int offset, int limit = 25)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var notifications = await _databaseContext.Notifications
                .Where(n => n.RecipientId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Skip(offset)
                .Take(limit)
                .Select(notification => new NotificationModel()
                {
                    Id = notification.Id,
                    AuthorUsername = notification.AuthorUsername,
                    Message = notification.Message,
                    IsRead = notification.IsRead,
                    IsBookmarked = notification.IsBookmarked,
                    CreatedAt = notification.CreatedAt,
                })
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpPut("[action]/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var notification = await _databaseContext.Notifications
                .SingleOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null)
                return NotFound(new { Message = "Notification not found" });

            notification.IsRead = true;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = $"Notification {notification.Id} marked as read" });
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var unreadNotifications = await _databaseContext.Notifications
                .Where(n => n.RecipientId == userId && !n.IsRead)
                .ToListAsync();

            if (unreadNotifications.Count == 0)
                return NotFound(new { Message = "No unread notifications" });

            unreadNotifications.ForEach(n => n.IsRead = true);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "All notifications marked as read" });
        }

        [HttpPut("[action]/{notificationId}")]
        public async Task<IActionResult> UpdateBookmarkStatus(int notificationId)
        {
            var notification = await _databaseContext.Notifications
                .Where(n => n.Id == notificationId)
                .SingleOrDefaultAsync();

            if (notification == null)
                return NotFound(new { Message = "Notification not found" });

            notification.IsBookmarked = !notification.IsBookmarked;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = $"Notification {notification.Id} bookmark status updated" });
        }

        [HttpDelete("[action]/{notificationId}")]
        public async Task<IActionResult> Delete(int notificationId)
        {
            var notification = await _databaseContext.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null)
                return NotFound(new { Message = "Notification not found" });

            _databaseContext.Notifications.Remove(notification);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = $"Notification {notification.Id} deleted" });
        }

        public async Task<IActionResult> PostNotifications(NewNotificationModel newNotificationModel)
        {
            var notifications = await _databaseContext.UserFollows
                .Where(f => f.FollowedId == newNotificationModel.AuthorId && f.EnabledNotifications)
                .Select(f => new Notification()
                {
                    RecipientId = f.FollowerId,
                    AuthorUsername = newNotificationModel.AuthorUsername,
                    Message = newNotificationModel.Message,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                })
                .ToListAsync();

            if (notifications.Count == 0)
                return NotFound(new { Message = "No followers to send notifications to" });

            await _databaseContext.Notifications.AddRangeAsync(notifications);
            await _databaseContext.SaveChangesAsync();

            return Ok(notifications);
        }
        public async Task<IActionResult> NotifyFollowers(NewNotificationModel newNotificationModel)
        {
            var response = (ObjectResult)await PostNotifications(newNotificationModel);

            if (response.Value is not List<Notification> notifications)
                return NotFound(response.Value);

            var connectionIds = notifications.Select(n => _hubs.NotificationHub.GetUserConnecion(n.RecipientId)).Where(id => id != null).ToList();
            if (connectionIds.Count != 0)
            {
                await _notificationHubContext.Clients.Clients(connectionIds).SendAsync("ReceiveNotification", new { newNotificationModel.AuthorUsername, newNotificationModel.Message, });
            }

            return Ok(new { Message = "Followers notified" });
        }
    }
}
