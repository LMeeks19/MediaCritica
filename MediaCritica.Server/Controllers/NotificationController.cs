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
        [HttpGet("[action]/{userId}")]
        public async Task<IActionResult> GetNotifications(int userId)
        {
            var notifications = await _databaseContext.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(notification => new NotificationModel()
                {
                    Id = notification.Id,
                    Message = notification.Message,
                    IsRead = notification.IsRead,
                    CreatedAt = notification.CreatedAt,
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // Mark a single notification as read
        [HttpPost("[action]/{notificationId}")]
        public async Task<IActionResult> MarkAsRead(int notificationId)
        {
            var notification = await _databaseContext.Notifications
                .FindAsync(notificationId);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _databaseContext.SaveChangesAsync();

            return Ok();
        }

        // Mark all notifications as read for a user
        [HttpPost("[action]/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(int userId)
        {
            var notifications = await _databaseContext.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (notifications.Count == 0)
                return NoContent();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _databaseContext.SaveChangesAsync();
            return Ok();
        }

        // Notify followers about a new review
        [HttpPost("[action]")]
        public async Task<IActionResult> NotifyFollowers([FromBody] NewNotificationModel newNotificationModel)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Followers)
                .SingleOrDefaultAsync(u => u.Id == newNotificationModel.AuthorId);

            if (user == null)
                return NotFound();

            foreach (var follower in user.Followers.Where(f => f.EnabledNotifications))
            {
                // Create notification in the database
                var notification = new Notification
                {
                    UserId = follower.FollowerId,
                    Message = $"New review posted: {newNotificationModel.ReviewTitle}",
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };

                await _databaseContext.Notifications.AddAsync(notification);

                // Send real-time notification via SignalR
                var connectionId = _notificationHub.GetUserConnecion(notification.UserId);
                if (connectionId != null)
                {
                    await _notificationHubContext.Clients.Client(connectionId).SendAsync("ReceiveNotification");
                }
            }

            await _databaseContext.SaveChangesAsync();

            return Ok();
        }
    }
}
