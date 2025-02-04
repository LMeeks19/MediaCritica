using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using Moq;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    public class MediaControllerSteps
    {
        // TODO
        private MediaController _controller;

        [BeforeFeature]
        public void BeforeScenario()
        {
            var mapper = new Mock<IMapper>().Object;
            var configuration = new Mock<IConfiguration>().Object;

            _controller = new MediaController(GlobalSteps._dbContext, mapper, new ExternalApiHelper(configuration), new InternalApiHelper(GlobalSteps._dbContext), new DateRangeCalculatorHelper(new DateTimeProviderHelper()));
        }
    }
}
