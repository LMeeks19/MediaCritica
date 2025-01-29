using MediaCritica.Server.Controllers;
using MediaCritica.Server.Hubs;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class NotificationControllerSteps
    {
        private NotificationController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);

            var mockHubContext = new Mock<IHubContext<NotificationHub>>();
            mockHubContext.Setup(context => context.Clients).Returns(mockClients.Object);

            var hubContext = mockHubContext.Object;

            _controller = new NotificationController(GlobalSetup._dbContext, hubContext, new NotificationHub());
        }

        [When(@"I call GetUserNotifications with userId (\d+)")]
        public async Task WhenICallGetUserNotificationsWithUserId(int userId)
        {
            GlobalSetup._response = await _controller.GetUserNotifications(userId, 0);
        }

        [Then(@"The NotificationModels should be")]
        public void TheNotificationModelsShouldBe(Table table)
        {
            var result = (OkObjectResult)GlobalSetup._response;
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
                Assert.AreEqual(expectedNotification.AuthorName, actualNotification.AuthorName);
                Assert.AreEqual(expectedNotification.Message, actualNotification.Message);
                Assert.AreEqual(expectedNotification.CreatedAt, actualNotification.CreatedAt);
                Assert.AreEqual(expectedNotification.IsRead, actualNotification.IsRead);
                Assert.AreEqual(expectedNotification.IsBookmarked, actualNotification.IsBookmarked);
            }
        }

        [Then(@"The NotificationModels should be empty")]
        public void TheNotificationModelsShouldBeEmpty()
        {
            var result = (OkObjectResult)GlobalSetup._response;
            Assert.IsNotNull(result);
            var expectedNotifications = result.Value as List<NotificationModel>;
            Assert.IsEmpty(expectedNotifications);
        }
    }
}
