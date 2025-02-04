using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Hubs;
using MediaCritica.Server.Mappers;
using Microsoft.AspNetCore.SignalR;
using Moq;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class ReviewControllerSteps
    {
        // TODO
        private ReviewController _controller;

        [BeforeFeature]
        public void BeforeScenario()
        {
            var hubContext = new Mock<IHubContext<NotificationHub>>().Object;

            _controller = new ReviewController(GlobalSteps._dbContext, new ReviewMapper(), new MilestoneCalculatorHelper(GlobalSteps._dbContext, new DateRangeCalculatorHelper(new DateTimeProviderHelper())), new NotificationController(GlobalSteps._dbContext, hubContext, new NotificationHub()));
        }
    }
}
