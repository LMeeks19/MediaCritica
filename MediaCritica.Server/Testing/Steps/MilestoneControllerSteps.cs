using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class MilestoneControllerSteps
    {
        private MilestoneController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _controller = new MilestoneController(GlobalSetup._dbContext, new MilestoneCalculatorHelper(GlobalSetup._dbContext, new DateRangeCalculatorHelper()));
        }
    }
}
