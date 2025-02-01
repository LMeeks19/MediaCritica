using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing
{
    [Binding]
    public class GlobalSteps
    {
        private static DbContextOptions<DatabaseContext> _options;
        public static DatabaseContext _dbContext;
        public static IActionResult _response;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: new Guid().ToString())
                .Options;

            _dbContext = new DatabaseContext(_options);
        }

        [AfterScenario]
        public async Task AfterScenario()
        {
            await _dbContext.Database.EnsureDeletedAsync();
        }

        [Given(@"I have the following users")]
        public async Task GivenIHaveTheFollowingUsers(Table table)
        {
            var users = table.CreateSet(row =>
            {
                return new User
                {
                    Id = int.Parse(row["Id"]),
                    Forename = row["Forename"],
                    Surname = row["Surname"],
                    Email = row["Email"],
                    Password = row["Password"],
                    Joined = DateOnly.Parse(row["Joined"])
                };
            }).ToList();

            await _dbContext.Users.AddRangeAsync(users);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following preferences")]
        public async Task GivenIHaveTheFollowingPreferences(Table table)
        {
            var preferences = table.CreateSet<Preference>().ToList();
            await _dbContext.Preferences.AddRangeAsync(preferences);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following notifications")]
        public async Task GivenIHaveTheFollowingNotifications(Table table)
        {
            var notifications = table.CreateSet<Notification>().ToList();
            await _dbContext.Notifications.AddRangeAsync(notifications);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following userFollows")]
        public async Task GivenIHaveTheFollowingUserFollows(Table table)
        {
            var userFollows = table.CreateSet<UserFollow>().ToList();
            await _dbContext.UserFollows.AddRangeAsync(userFollows);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following reviews")]
        public async Task GivenIHaveTheFollowingReviews(Table table)
        {
            var reviews = table.CreateSet<Review>().ToList();
            await _dbContext.Reviews.AddRangeAsync(reviews);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following engagements")]
        public async Task GivenIHaveTheFollowingEngagements(Table table)
        {
            var engagements = table.CreateSet<Engagement>().ToList();
            await _dbContext.Engagements.AddRangeAsync(engagements);
            await _dbContext.SaveChangesAsync();
        }

        [Then(@"The status code should be (\d+)")]
        public void ThenTheStatusCodeShouldBe(int statusCode)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(statusCode, result.StatusCode!);
        }

        [Then(@"The response should be ""(.*)""")]
        public void ThenTheResponseShouldBe(string message)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(message, result.Value);
        }
    }
}
