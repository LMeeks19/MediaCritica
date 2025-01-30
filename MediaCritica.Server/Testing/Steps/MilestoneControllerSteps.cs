using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    public class MilestoneTestModel
    {
        public string Category { get; set; }
        public int Milestones { get; set; }
    }


    [Binding]
    public class MilestoneControllerSteps
    {
        private MilestoneController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _controller = new MilestoneController(GlobalSetup._dbContext, new MilestoneCalculatorHelper(GlobalSetup._dbContext, new DateRangeCalculatorHelper()));
        }

        [When(@"I call GetUserMilestones with UserId (\d+)")]
        public async Task WhenICallGetUserMilestonesWithId(int userId)
        {
            GlobalSetup._response = await _controller.GetUserMilestones(userId);
        }

        [Then(@"The MilestoneCategoryModels should be")]
        public void ThenTheMilestoneCategoryModelsShouldBe(Table table)
        {
            var expextedMilestoneCategoryModels = table.CreateSet<MilestoneTestModel>();

            var result = (OkObjectResult)GlobalSetup._response;
            Assert.IsNotNull(result);
            var actualMilestoneCategoryModels = result.Value as List<MilestoneCategoryModel>;
            Assert.IsNotEmpty(actualMilestoneCategoryModels);

            foreach (var expectedMilestoneCategoryModel in expextedMilestoneCategoryModels)
            {
                var actualMilestoneCategoryModel = actualMilestoneCategoryModels.SingleOrDefault(mcm => mcm.Category == expectedMilestoneCategoryModel.Category);
                Assert.IsNotNull(actualMilestoneCategoryModel);

                Assert.AreEqual(expectedMilestoneCategoryModel.Category, actualMilestoneCategoryModel.Category);
                Assert.AreEqual(expectedMilestoneCategoryModel.Milestones, actualMilestoneCategoryModel.Milestones.Count);
            }

        }
    }
}
