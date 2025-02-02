using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class LeaderboardControllerSteps
    {
        // TODO
        private LeaderboardController _controller;
        private Mock<IDateTimeProviderHelper> _mockDateTimeProvider;

        [BeforeScenario]
        public void BeforeScenario()
        {
            var mockDateTimeProviderHelper = new Mock<IDateTimeProviderHelper>();
            mockDateTimeProviderHelper.Setup(provider => provider.Now).Returns(new DateTime(2025, 2, 27));
            var dateTimeProviderHelper = mockDateTimeProviderHelper.Object;

            _controller = new LeaderboardController(GlobalSteps._dbContext, new DateRangeCalculatorHelper(dateTimeProviderHelper), new TrendCalculatorHelper());
        }

        [When(@"I call GetUserRankings for (week|month|year|all-time)")]
        public void WhenICallGetUserRankingsForThis(string timeframe)
        {
            GlobalSteps._response = _controller.GetUserRankings(timeframe).Result;
        }

        [Then(@"The UserRankingModels reposne should be")]
        public void TheUserRankingModelsReposneShouldBe(Table table)
        {
            var expectedUserRankingModels = table.CreateSet<UserRankingModel>().ToList();
            Assert.IsNotEmpty(expectedUserRankingModels);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualUserRankingModels = result.Value as List<UserRankingModel>;
            Assert.IsNotEmpty(actualUserRankingModels);

            Assert.IsTrue(expectedUserRankingModels.Count == actualUserRankingModels.Count);

            for (var i = 0; i < actualUserRankingModels.Count; i++)
            {
                var expectedUserRankingModel = expectedUserRankingModels[i];
                var actualUserRankingModel = actualUserRankingModels[i];

                Assert.AreEqual(expectedUserRankingModel.Rank, actualUserRankingModel.Rank);
                Assert.AreEqual(expectedUserRankingModel.Name, actualUserRankingModel.Name);
                Assert.AreEqual(expectedUserRankingModel.Reviews, actualUserRankingModel.Reviews);
                Assert.AreEqual(expectedUserRankingModel.Timeframe, actualUserRankingModel.Timeframe);
            }
        }
    }
}
