using MediaCritica.Server.Controllers;
using MediaCritica.Server.Mappers;
using Moq;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class MediaControllerSteps
    {
        // TODO
        private MediaController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            var mapper = new Mock<IMapper>().Object;
            var configuration = new Mock<IConfiguration>().Object;
            // _controller = new MediaController(GlobalSteps._dbContext, mapper, new ExternalApiHelper(configuration), new InternalApiHelper(GlobalSteps._dbContext), new DateRangeCalculatorHelper(new DateTimeProviderHelper()));
        }
    }
}
