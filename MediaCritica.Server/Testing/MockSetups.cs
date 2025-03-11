using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Hubs;
using MediaCritica.Server.Mappers;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace MediaCritica.Server.Testing
{
    public static class MockSetups
    {
        private static IMappers SetupMapper(DatabaseContext dbContext, IHelpers helper)
        {
            var mapper = new Mock<IMappers>();

            mapper.Setup(m => m.ReviewMapper).Returns(new ReviewMapper());
            mapper.Setup(m => m.RatingMapper).Returns(new RatingMapper());
            mapper.Setup(m => m.BacklogMapper).Returns(new BacklogMapper());
            mapper.Setup(m => m.UserMapper).Returns(new UserMapper(helper, mapper.Object));
            mapper.Setup(m => m.MediaMapper).Returns(new MediaMapper(mapper.Object));
            mapper.Setup(m => m.MovieMapper).Returns(new MovieMapper(mapper.Object));
            mapper.Setup(m => m.GameMapper).Returns(new GameMapper(mapper.Object));
            mapper.Setup(m => m.EpisodeMapper).Returns(new EpisodeMapper(mapper.Object));
            mapper.Setup(m => m.SeasonMapper).Returns(new SeasonMapper(mapper.Object));
            mapper.Setup(m => m.SeriesMapper).Returns(new SeriesMapper(mapper.Object));

            return mapper.Object;
        }

        private static IHelpers SetupHelper(DatabaseContext dbContext, IConfiguration configuration)
        {
            var helper = new Mock<IHelpers>();
            helper.Setup(h => h.TrendCalculatorHelper).Returns(new TrendCalculatorHelper());
            helper.Setup(h => h.DateTimeProviderHelper).Returns(new DateTimeProviderHelper(new(2025, 2, 27)));
            helper.Setup(h => h.DateRangeCalculatorHelper).Returns(new DateRangeCalculatorHelper(helper.Object));
            helper.Setup(h => h.ExternalApiHelper).Returns(new ExternalApiHelper(configuration, true));
            helper.Setup(h => h.InternalApiHelper).Returns(new InternalApiHelper(dbContext));
            helper.Setup(h => h.MilestoneCalculatorHelper).Returns(new MilestoneCalculatorHelper(dbContext));

            return helper.Object;
        }

        private static IConfiguration SetupConfiguration()
        {
            var configuration = new Mock<IConfiguration>();
            return configuration.Object;
        }

        private static IHubContext<NotificationHub> SetupNotificationHub()
        {
            var hubContext = new Mock<IHubContext<NotificationHub>>();
            return hubContext.Object;
        }

        private static IHubs SetupHub()
        {
            var hubs = new Mock<IHubs>();
            return hubs.Object;
        }

        public static IControllers SetupController(DatabaseContext dbContext)
        {
            var configuration = SetupConfiguration();
            var helper = SetupHelper(dbContext, configuration);
            var mapper = SetupMapper(dbContext, helper);
            var hubContext = SetupNotificationHub();
            var hub = SetupHub();

            var controller = new Mock<IControllers>();

            controller.Setup(c => c.BacklogController).Returns(new BacklogController(dbContext, mapper, helper));
            controller.Setup(c => c.EngagementController).Returns(new EngagementController(dbContext, helper));
            controller.Setup(c => c.FollowController).Returns(new FollowController(dbContext));
            controller.Setup(c => c.LeaderboardController).Returns(new LeaderboardController(dbContext, helper));
            controller.Setup(c => c.MediaController).Returns(new MediaController(dbContext, mapper, helper));
            controller.Setup(c => c.MilestoneController).Returns(new MilestoneController(dbContext, helper));
            controller.Setup(c => c.NotificationController).Returns(new NotificationController(dbContext, hubContext, hub));
            controller.Setup(c => c.ReviewController).Returns(new ReviewController(dbContext, mapper, helper, controller.Object));
            controller.Setup(c => c.UserController).Returns(new UserController(dbContext, mapper));

            return controller.Object;
        }
    }
}
