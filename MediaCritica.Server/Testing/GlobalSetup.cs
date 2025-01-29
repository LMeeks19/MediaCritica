using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing
{
    [Binding]
    public class GlobalSetup
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

        [Then(@"The status code should be (\d+)")]
        public void ThenTheStatusCodeShouldBe(int statusCode)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(statusCode, result.StatusCode!);
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
    }
}
