using MediaCritica.Server.Controllers;
using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System.Text.RegularExpressions;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class EngagementControllerSteps
    {
        private EngagementController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _controller = new EngagementController(GlobalSteps._dbContext, new MilestoneCalculatorHelper(GlobalSteps._dbContext, new DateRangeCalculatorHelper()));
        }

        [When(@"I call GetUserEngagement with review id (\d+) and user id (\d+)")]
        public async Task WhenICallGetUserEngagementWithReviewIdAndUserId(int reviewId, int userId)
        {
            GlobalSteps._response = await _controller.GetUserEngagement(reviewId, userId);
        }

        [When(@"I call ToggleEngagement with review id (\d+), user id (\d+) and engagement type (-1|0|1)")]
        public async Task WhenICallToggleEngagementWithReviewIdAndUserIdAndEngagementType(int reviewId, int userId, string engagementType)
        {
            GlobalSteps._response = await _controller.ToggleEngagement(userId, reviewId, Enum.Parse<EngagementType>(engagementType));
        }

        [Then(@"The response should be a (like|dislike)")]
        public void ThenTheResponseShouldBeALikeOrDislike(string type)
        {
            Assert.IsTrue(Regex.IsMatch(type, @"^(like|dislike)$"));
            var expectedEngagementType = type == "like" ? EngagementType.Like : EngagementType.Dislike;
            Assert.IsNotNull(expectedEngagementType);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualEngagementType = result.Value;
            Assert.IsInstanceOf<EngagementType>(actualEngagementType);

            Assert.AreEqual(expectedEngagementType, actualEngagementType);
        }

        [Then(@"The engagement should have been (created|updated|deleted)")]
        public async Task TheEngagementShouldBeCreatedOrUpdatedOrDeleted(string action, Table table)
        {
            var expectedEnaggement = table.RowCount == 0 ? null : table.Rows[0].CreateInstance<Engagement>();
            Engagement? actualEngagement = null;

            if (expectedEnaggement != null)
                actualEngagement = await GlobalSteps._dbContext.Engagements.SingleOrDefaultAsync(e => e.Id == expectedEnaggement.Id);

            if (actualEngagement == null)
                Assert.AreEqual(expectedEnaggement, actualEngagement);
            else
            {
                Assert.AreEqual(expectedEnaggement.Id, actualEngagement.Id);
                Assert.AreEqual(expectedEnaggement.UserId, actualEngagement.UserId);
                Assert.AreEqual(expectedEnaggement.ReviewId, actualEngagement.ReviewId);
                Assert.AreEqual(expectedEnaggement.Type, actualEngagement.Type);
            }
        }
    }
}
