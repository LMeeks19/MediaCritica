using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    public class BacklogControllerSteps
    {
        // TODO

        private BacklogController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _controller = new BacklogController(GlobalSteps._dbContext, new BacklogMapper(), new MilestoneCalculatorHelper(GlobalSteps._dbContext, new DateRangeCalculatorHelper(new DateTimeProviderHelper())));
        }
    }
}
