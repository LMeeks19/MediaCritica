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

        [BeforeScenario]
        public void BeforeScenario()
        {
            var mockDateTimeProviderHelper = new Mock<IDateTimeProviderHelper>();
            mockDateTimeProviderHelper.Setup(provider => provider.Now).Returns(new DateTime(2025, 2, 27));
            var dateTimeProviderHelper = mockDateTimeProviderHelper.Object;

            _controller = new LeaderboardController(GlobalSteps._dbContext, new DateRangeCalculatorHelper(dateTimeProviderHelper), new TrendCalculatorHelper());
        }

        [When(@"I call GetUserRankings for (week|month|year|all-time)")]
        public async Task WhenICallGetUserRankingsForThis(string timeframe)
        {
            GlobalSteps._response = await _controller.GetUserRankings(timeframe);
        }

        [When(@"I call GetMediaTrends for (week|month|year|all-time)")]
        public async Task WhenICallGetMediaTrendssForThis(string timeframe)
        {
            GlobalSteps._response = await _controller.GetMediaTrends(timeframe);
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

        [Then(@"The MediaTrendModels reposne should be")]
        public void TheMediaTrendModelsReposneShouldBe(Table table)
        {
            var expectedMediaTrendgModels = table.CreateSet<MediaTrendModel>().ToList();
            Assert.IsNotEmpty(expectedMediaTrendgModels);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualMediaTrendModels = result.Value as List<MediaTrendModel>;
            Assert.IsNotEmpty(actualMediaTrendModels);

            Assert.IsTrue(expectedMediaTrendgModels.Count == actualMediaTrendModels.Count);

            for (var i = 0; i < actualMediaTrendModels.Count; i++)
            {
                var expectedMediaTrendModel = expectedMediaTrendgModels[i];
                var actualMediaTrendModel = actualMediaTrendModels[i];

                Assert.AreEqual(expectedMediaTrendModel.AwardType, actualMediaTrendModel.AwardType);
                Assert.AreEqual(expectedMediaTrendModel.Title, actualMediaTrendModel.Title);
                Assert.AreEqual(expectedMediaTrendModel.Description, actualMediaTrendModel.Description);
                Assert.AreEqual(expectedMediaTrendModel.Timeframe, actualMediaTrendModel.Timeframe);
            }
        }
    }
}
