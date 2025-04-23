using MediaCritica.Server.Controllers;
using MediaCritica.Server.Models;
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
        public static IControllers _controller;

        [BeforeScenario]
        public void BeforeScenario()
        {
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: new Guid().ToString())
                .Options;

            _dbContext = new DatabaseContext(_options);

            _controller = MockSetups.SetupController(_dbContext);
        }

        [AfterScenario]
        public async Task AfterScenario()
        {
            await _dbContext.Database.EnsureDeletedAsync();
        }

        [Given(@"I have the following users")]
        public async Task GivenIHaveTheFollowingUsers(Table table)
        {
            var users = table.Rows.Select(row =>
            {
                var password = BCrypt.Net.BCrypt.EnhancedHashPassword(row["Password"]);
                return new User
                {
                    Id = int.Parse(row["Id"]),
                    Username = row["Username"],
                    Forename = row["Forename"],
                    Surname = row["Surname"],
                    Email = row["Email"],
                    Password = password,
                    Joined = DateTime.Parse(row["Joined"]),
                };
            }).ToList();

            await _dbContext.Users.AddRangeAsync(users);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I am the following user")]
        public async Task GivenIAmTheFollowingUser(Table table)
        {
            var userLoginModel = table.Rows[0].CreateInstance<UserLoginModel>();
            await _controller.UserController.Login(userLoginModel);
        }

        [Given(@"I have the following preferences")]
        public async Task GivenIHaveTheFollowingPreferences(Table table)
        {
            var preferences = table.CreateSet<Preference>().ToList();
            await _dbContext.Preferences.AddRangeAsync(preferences);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following auth tokens")]
        public async void GivenIHaveTheFollowingAuthTokens(Table table)
        {
            var authTokens = table.CreateSet<AuthToken>().ToList();
            await _dbContext.AuthTokens.AddRangeAsync(authTokens);
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

        [Given(@"I have the following movies")]
        public async Task GivenIHaveTheFollowingMovies(Table table)
        {
            var movies = table.CreateSet<Movie>().ToList();

            await _dbContext.Movies.AddRangeAsync(movies);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following series")]
        public async Task GivenIHaveTheFollowingSeries(Table table)
        {
            var series = table.CreateSet<Series>().ToList();

            await _dbContext.Series.AddRangeAsync(series);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following games")]
        public async Task GivenIHaveTheFollowingGames(Table table)
        {
            var games = table.CreateSet<Game>().ToList();

            await _dbContext.Games.AddRangeAsync(games);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following episodes")]
        public async Task GivenIHaveTheFollowingepisodes(Table table)
        {
            var episodes = table.CreateSet<Episode>().ToList();

            await _dbContext.Episodes.AddRangeAsync(episodes);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following seasons")]
        public async Task GivenIHaveTheFollowingSeasons(Table table)
        {
            var seasons = table.CreateSet<Season>().ToList();

            await _dbContext.Seasons.AddRangeAsync(seasons);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following backlogs")]
        public async Task GivenIHaveTheFollowingBacklogs(Table table)
        {
            var backlogs = table.CreateSet<Backlog>().ToList();
            await _dbContext.Backlogs.AddRangeAsync(backlogs);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following comments")]
        public async Task GivenIHaveTheFollowingComments(Table table)
        {
            var comments = table.Rows.Select(row => new Comment
            {
                Id = int.Parse(row["Id"]),
                ReviewId = int.Parse(row["ReviewId"]),
                ParentId = row["ParentId"] == "<null>" ? null : int.Parse(row["ParentId"]),
                Content = row["Content"],
                CommenterId = int.Parse(row["CommenterId"]),
                CommentedAt = DateTime.Parse(row["CommentedAt"]),
                IsDeleted = bool.Parse(row["IsDeleted"]),
            }).ToList();
            await _dbContext.Comments.AddRangeAsync(comments);
            await _dbContext.SaveChangesAsync();
        }

        [Given(@"I have the following reports")]
        public async Task GivenIHaveTheFollowingReports(Table table)
        {
            var reports = table.CreateSet<Report>().ToList();
            await _dbContext.Reports.AddRangeAsync(reports);
            await _dbContext.SaveChangesAsync();
        }

        [Then(@"The status code should be (\d+)")]
        public void ThenTheStatusCodeShouldBe(int statusCode)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(statusCode, result.StatusCode!);
        }

        [Then(@"The response should be ""(.*)""")]
        public void ThenTheResponseShouldBeString(string message)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(new { Message = message }, result.Value);
        }

        [Then(@"The response should be (true|false)")]
        public void ThenTheResponseShouldBeBool(bool value)
        {
            var result = (ObjectResult)_response;
            Assert.AreEqual(new { Value = value }, result.Value);
        }

        [Then(@"The following report should be in the database")]
        public async Task ThenTheFollowingReportShouldBeInTheDatabase(Table table)
        {
            var expectedReport = table.Rows[0].CreateInstance<Report>();
            var actualReport = await _dbContext.Reports.SingleOrDefaultAsync(r => r.Id == expectedReport.Id);

            Assert.AreEqual(expectedReport.Id, actualReport.Id);
            Assert.AreEqual(expectedReport.ReviewId, actualReport.ReviewId);
            Assert.AreEqual(expectedReport.CommentId, actualReport.CommentId);
            Assert.AreEqual(expectedReport.ReporterId, actualReport.ReporterId);
            Assert.AreEqual(expectedReport.Reason, actualReport.Reason);
            Assert.AreEqual(expectedReport.Details, actualReport.Details);
            Assert.AreEqual(expectedReport.ReportedAt, actualReport.ReportedAt);
        }
    }
}
