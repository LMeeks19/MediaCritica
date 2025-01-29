using MediaCritica.Server.Controllers;
using MediaCritica.Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class NotificationControllerSteps
    {
        private NotificationController _controller;
        private IActionResult _response;

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

        [AfterScenario]
        public async Task AfterScenario()
        {
            var notifications = await GlobalSetup._dbContext.Notifications.ToListAsync();
            GlobalSetup._dbContext.Notifications.RemoveRange(notifications);
            await GlobalSetup._dbContext.SaveChangesAsync();
        }
    }
}
