using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Hubs;
using MediaCritica.Server.Mappers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace MediaCritica.Server.Testing
{
    public static class MockSetups
    {
        private static IMappers SetupMapper(IHelpers helper)
        {
            var mapper = new Mock<IMappers>();

            mapper.Setup(m => m.ReviewMapper).Returns(new ReviewMapper());
            mapper.Setup(m => m.RatingMapper).Returns(new RatingMapper());
            mapper.Setup(m => m.BacklogMapper).Returns(new BacklogMapper());
            mapper.Setup(m => m.UserMapper).Returns(new UserMapper(helper, mapper.Object.ReviewMapper));
            mapper.Setup(m => m.MediaMapper).Returns(new MediaMapper(mapper.Object.RatingMapper, mapper.Object.ReviewMapper));
            mapper.Setup(m => m.MovieMapper).Returns(new MovieMapper(mapper.Object.MediaMapper));
            mapper.Setup(m => m.GameMapper).Returns(new GameMapper(mapper.Object.MediaMapper));
            mapper.Setup(m => m.EpisodeMapper).Returns(new EpisodeMapper(mapper.Object.MediaMapper));
            mapper.Setup(m => m.SeasonMapper).Returns(new SeasonMapper(mapper.Object.EpisodeMapper));
            mapper.Setup(m => m.SeriesMapper).Returns(new SeriesMapper(mapper.Object.MediaMapper, mapper.Object.SeasonMapper));
            mapper.Setup(m => m.CommentMapper).Returns(new CommentMapper());

            return mapper.Object;
        }

        private static IHelpers SetupHelper(DatabaseContext dbContext, IConfiguration configuration, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            var httpContext = SetupHttpContext();

            var helper = new Mock<IHelpers>();
            helper.Setup(h => h.TrendCalculatorHelper).Returns(new TrendCalculatorHelper());
            helper.Setup(h => h.DateRangeCalculatorHelper).Returns(new DateRangeCalculatorHelper(dateTimeProviderHelper));
            helper.Setup(h => h.ExternalApiHelper).Returns(new ExternalApiHelper(configuration, true));
            helper.Setup(h => h.InternalApiHelper).Returns(new InternalApiHelper(dbContext));
            helper.Setup(h => h.MilestoneCalculatorHelper).Returns(new MilestoneCalculatorHelper(dbContext, dateTimeProviderHelper));
            helper.Setup(h => h.AuthenticationHelper).Returns(new AuthenticationHelper(dbContext, dateTimeProviderHelper, httpContext, true));

            return helper.Object;
        }

        private static IDateTimeProviderHelper SetupDateTimeProviderHelper()
        {
            var dateTimeProviderHelper = new Mock<IDateTimeProviderHelper>();
            dateTimeProviderHelper.Setup(provider => provider.UtcNow).Returns(new DateTime(2025, 2, 27));
            return dateTimeProviderHelper.Object;
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

        private static IHttpContextAccessor SetupHttpContext()
        {
            var mockHttpContext = new Mock<IHttpContextAccessor>();

            var mockServiceProvider = new Mock<IServiceProvider>();
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            mockServiceProvider
                .Setup(sp => sp.GetService(typeof(IAuthenticationService)))
                .Returns(mockAuthenticationService.Object);

            mockHttpContext.Setup(ctx => ctx.HttpContext).Returns(new DefaultHttpContext());
            mockHttpContext.Setup(ctx => ctx.HttpContext!.RequestServices).Returns(mockServiceProvider.Object);
            mockHttpContext.SetupProperty(ctx => ctx.HttpContext!.User);

            return mockHttpContext.Object;
        }

        public static IControllers SetupController(DatabaseContext dbContext)
        {
            var configuration = SetupConfiguration();
            var dateTimeProviderHelper = SetupDateTimeProviderHelper();
            var helper = SetupHelper(dbContext, configuration, dateTimeProviderHelper);
            var mapper = SetupMapper(helper);
            var hubContext = SetupNotificationHub();
            var hub = SetupHub();

            var controller = new Mock<IControllers>();

            controller.Setup(c => c.BacklogController).Returns(new BacklogController(dbContext, mapper, helper, dateTimeProviderHelper));
            controller.Setup(c => c.EngagementController).Returns(new EngagementController(dbContext, helper));
            controller.Setup(c => c.FollowController).Returns(new FollowController(dbContext, helper, dateTimeProviderHelper));
            controller.Setup(c => c.LeaderboardController).Returns(new LeaderboardController(dbContext, helper));
            controller.Setup(c => c.MediaController).Returns(new MediaController(dbContext, mapper, helper, dateTimeProviderHelper));
            controller.Setup(c => c.MilestoneController).Returns(new MilestoneController(dbContext, helper));
            controller.Setup(c => c.NotificationController).Returns(new NotificationController(dbContext, helper, hubContext, hub, dateTimeProviderHelper));
            controller.Setup(c => c.ReviewController).Returns(new ReviewController(dbContext, mapper, helper, dateTimeProviderHelper, controller.Object.NotificationController));
            controller.Setup(c => c.UserController).Returns(new UserController(dbContext, mapper, helper));
            controller.Setup(c => c.CommentController).Returns(new CommentController(dbContext, mapper, dateTimeProviderHelper));

            return controller.Object;
        }
    }
}
