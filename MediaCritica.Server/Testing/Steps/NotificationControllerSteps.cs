using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class NotificationControllerSteps
    {
        [When(@"I call GetUserNotifications")]
        public async Task WhenICallGetUserNotifications()
        {
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.GetUserNotifications(0);
        }

        [When(@"I call MarkAsRead with Id (\d+)")]
        public async Task WhenICallMarkAsReadWithId(int notificationId)
        {
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.MarkAsRead(notificationId);
        }

        [When(@"I call MarkAllAsRead")]
        public async Task WhenICallMarkAllAsRead()
        {
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.MarkAllAsRead();
        }

        [When(@"I call UpdateBookmarkStatus with Id (\d+)")]
        public async Task WhenICallUpdateBookmarkStatusWithId(int notificationId)
        {
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.UpdateBookmarkStatus(notificationId);
        }

        [When(@"I call Delete with Id (\d+)")]
        public async Task WhenICallDeleteWithId(int notificationId)
        {
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.Delete(notificationId);
        }

        [When(@"I call PostNotifications with the NewNotificationModel")]
        public async Task WhenICallPostNotificationsWithTheNewNotificationModel(Table table)
        {
            var newNotificationModel = table.CreateInstance<NewNotificationModel>();
            GlobalSteps._response = await GlobalSteps._controller.NotificationController.PostNotifications(newNotificationModel);
        }

        [Then(@"The NotificationModels should be")]
        public void TheNotificationModelsShouldBe(Table table)
        {
            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualNotifications = result.Value as List<NotificationModel>;
            Assert.IsNotNull(actualNotifications);
            Assert.IsNotEmpty(actualNotifications);

            foreach (var row in table.Rows)
            {
                var expectedNotification = row.CreateInstance<NotificationModel>();
                var actualNotification = actualNotifications.SingleOrDefault(n => n.Id == expectedNotification.Id);
                Assert.IsNotNull(expectedNotification);

                Assert.AreEqual(expectedNotification.Id, actualNotification.Id);
                Assert.AreEqual(expectedNotification.AuthorUsername, actualNotification.AuthorUsername);
                Assert.AreEqual(expectedNotification.Message, actualNotification.Message);
                Assert.AreEqual(expectedNotification.CreatedAt, actualNotification.CreatedAt);
                Assert.AreEqual(expectedNotification.IsRead, actualNotification.IsRead);
                Assert.AreEqual(expectedNotification.IsBookmarked, actualNotification.IsBookmarked);
            }
        }

        [Then(@"The NotificationModels should be empty")]
        public void TheNotificationModelsShouldBeEmpty()
        {
            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var expectedNotifications = result.Value as List<NotificationModel>;
            Assert.IsEmpty(expectedNotifications);
        }

        [Then(@"The Notification with Id (\d+) should be read")]
        public async Task TheNotificationWithIdShouldBeRead(int notificationId)
        {
            var notification = await GlobalSteps._dbContext.Notifications.SingleOrDefaultAsync(n => n.Id == notificationId);
            Assert.IsNotNull(notification);
            Assert.IsTrue(notification.IsRead);
        }

        [Then(@"The Notifications for UserId (\d+) should all be read")]
        public async Task TheNotificationsForUserIdShouldAllBeRead(int userId)
        {
            var notifications = await GlobalSteps._dbContext.Notifications.Where(n => n.RecipientId == userId).ToListAsync();
            Assert.True(notifications.All(n => n.IsRead));
        }

        [Then(@"The bookmark status of Notification (\d+) should be false")]
        public async Task TheBookmarkStatusOfNotificationShoulBeFalse(int notificationId)
        {
            var notification = await GlobalSteps._dbContext.Notifications.SingleOrDefaultAsync(n => n.Id == notificationId);
            Assert.IsNotNull(notification);
            Assert.IsFalse(notification.IsBookmarked);
        }

        [Then(@"The bookmark status of Notification (\d+) should be true")]
        public async Task TheBookmarkStatusOfNotificationShoulBeTrue(int notificationId)
        {
            var notification = await GlobalSteps._dbContext.Notifications.SingleOrDefaultAsync(n => n.Id == notificationId);
            Assert.IsNotNull(notification);
            Assert.IsTrue(notification.IsBookmarked);
        }

        [Then(@"Notifications should no longer contain notification with Id (\d+)")]
        public async Task NotificationShouldNoLongerContainNotificatioNWithId(int notificationId)
        {
            var notification = await GlobalSteps._dbContext.Notifications.SingleOrDefaultAsync(n => n.Id == notificationId);
            Assert.IsNull(notification);
        }

        [Then(@"The following notifications should have been created")]
        public async Task TheFollowingNotificationShouldHaveBeenCreated(Table table)
        {
            var expectedNotifications = table.CreateSet<Notification>();
            Assert.IsNotEmpty(expectedNotifications);

            foreach (var expectedNotification in expectedNotifications)
            {
                var actualNotification = await GlobalSteps._dbContext.Notifications.SingleOrDefaultAsync(n => n.Id == expectedNotification.Id);
                Assert.IsNotNull(actualNotification);
                Assert.AreEqual(expectedNotification.Id, actualNotification.Id);
                Assert.AreEqual(expectedNotification.RecipientId, actualNotification.RecipientId);
                Assert.AreEqual(expectedNotification.AuthorId, actualNotification.AuthorId);
                Assert.AreEqual(expectedNotification.Message, actualNotification.Message);
                Assert.AreEqual(expectedNotification.IsRead, actualNotification.IsRead);
                Assert.AreEqual(expectedNotification.IsBookmarked, actualNotification.IsBookmarked);
                Assert.AreEqual(expectedNotification.CreatedAt, actualNotification.CreatedAt);
            }
        }
    }
}
