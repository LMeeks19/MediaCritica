using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class LeaderboardControllerSteps
    {
        // TODO
        private LeaderboardController _controller;

        public void BeforeScenario()
        {
            _controller = new LeaderboardController(GlobalSteps._dbContext, new DateRangeCalculatorHelper(), new TrendCalculatorHelper());
        }

    }
}
