using MediaCritica.Server.Controllers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class FollowControllerSteps
    {
        // TODO

        private FollowController _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _controller = new FollowController(GlobalSteps._dbContext);
        }

        [When(@"I call GetUserFollowers with the UserId (\d+) and offset (\d+)")]
        public async Task WhenICallGetUserFollowersWithTheUserId(int userId, int offset)
        {
            GlobalSteps._response = await _controller.GetUserFollowers(userId, offset);
        }

        [When(@"I call GetUserFollowing with the UserId (\d+) and offset (\d+)")]
        public async Task WhenICallGetUserFollowingWithTheUserId(int userId, int offset)
        {
            GlobalSteps._response = await _controller.GetUserFollowing(userId, offset);
        }

        [When(@"I call GetUserFollowStatus for userId (\d+) on userId (\d+)")]
        public async Task WhenICallGetUserFollowStatusForUserIdOnUserId(int followerId, int followedId)
        {
            GlobalSteps._response = await _controller.GetUserFollowStatus(followerId, followedId);
        }

        [When(@"I call FollowUser with these values")]
        public async Task WhenICallFollowUserWithTheseValues(Table table)
        {
            var userFollowModel = table.Rows[0].CreateInstance<UserFollowModel>();
            GlobalSteps._response = await _controller.FollowUser(userFollowModel);
        }

        [When(@"I call UnfollowUser with the userFollowId (\d+)")]
        public async Task WhenICallUnfollowUserWithTheUserFollowId(int userFollowId)
        {
            GlobalSteps._response = await _controller.UnfollowUser(userFollowId);
        }

        [When(@"I call ToggleNotificationStatus with userFollowId (\d+)")]
        public async Task ICallToggleNotificationStatusWithUserFollowId(int userFollowId)
        {
            GlobalSteps._response = await _controller.ToggleNotificationStatus(userFollowId);
        }

        [Then(@"The UserFollowSummaryModels returned should be")]
        public void ThenTheUserFollowSummaryModelsReturnedShouldBe(Table table)
        {
            var expectedUserFollowSummaryModels = table.CreateSet<UserFollowSummaryModel>().ToList();
            Assert.IsNotNull(expectedUserFollowSummaryModels);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualUserFollowSummaryModels = result.Value as List<UserFollowSummaryModel>;
            Assert.IsNotEmpty(actualUserFollowSummaryModels);

            for (var i = 0; i <= expectedUserFollowSummaryModels.Count - 1; i++)
            {
                var expectedUserFollowSummaryModel = expectedUserFollowSummaryModels[i];
                Assert.IsNotNull(expectedUserFollowSummaryModel);
                var actualUserFollowSummaryModel = actualUserFollowSummaryModels[i];
                Assert.IsNotNull(actualUserFollowSummaryModel);

                Assert.AreEqual(expectedUserFollowSummaryModel.Id, actualUserFollowSummaryModel.Id);
                Assert.AreEqual(expectedUserFollowSummaryModel.UserId, actualUserFollowSummaryModel.UserId);
                Assert.AreEqual(expectedUserFollowSummaryModel.Name, actualUserFollowSummaryModel.Name);
                Assert.AreEqual(expectedUserFollowSummaryModel.FollowedOn, actualUserFollowSummaryModel.FollowedOn);
            }
        }

        [Then(@"The UserFollowModel should be")]
        public void ThenTheUserFollowModelShouldBe(Table table)
        {
            var expectedUserFollowModel = table.Rows[0].CreateInstance<UserFollowModel>();
            Assert.IsNotNull(expectedUserFollowModel);

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualUserFollowModel = result.Value as UserFollowModel;
            Assert.IsNotNull(actualUserFollowModel);

            Assert.AreEqual(expectedUserFollowModel.Id, actualUserFollowModel.Id);
            Assert.AreEqual(expectedUserFollowModel.FollowerId, actualUserFollowModel.FollowerId);
            Assert.AreEqual(expectedUserFollowModel.FollowedId, actualUserFollowModel.FollowedId);
            Assert.AreEqual(expectedUserFollowModel.FollowedOn, actualUserFollowModel.FollowedOn);
            Assert.AreEqual(expectedUserFollowModel.EnabledNotifications, actualUserFollowModel.EnabledNotifications);
        }

        [Then(@"The UserFollow with Id (\d+) should have been deleted")]
        public async Task ThebTheUserFollowWithIdShouldHaveBeenDeleted(int userFollowId)
        {
            var userFollowExists = await GlobalSteps._dbContext.UserFollows.AnyAsync(uf => uf.Id == userFollowId);
            Assert.False(userFollowExists);
        }

        [Then(@"The notification status of UserFollow with Id (\d+) should be false")]
        public async Task TheNotificatioStatusOfUserFollowWithIdShoulBeFalse(int userFollowId)
        {
            var notification = await GlobalSteps._dbContext.UserFollows.SingleOrDefaultAsync(n => n.Id == userFollowId);
            Assert.IsNotNull(notification);
            Assert.IsFalse(notification.EnabledNotifications);
        }

        [Then(@"The notification status of UserFollow with Id (\d+) should be true")]
        public async Task TheNotificationStatusOfUserFollowWithIdShoulBeTrue(int userFollowId)
        {
            var notification = await GlobalSteps._dbContext.UserFollows.SingleOrDefaultAsync(n => n.Id == userFollowId);
            Assert.IsNotNull(notification);
            Assert.IsTrue(notification.EnabledNotifications);
        }
    }
}
