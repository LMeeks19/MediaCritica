using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class UserControllerSteps
    {
        private static DbContextOptions<DatabaseContext> _options;
        private static DatabaseContext _dbContext;
        private static UserMapper _userMapper;
        private static UserController _controller;
        private IActionResult _response;
        private string _email;

        [BeforeFeature]
        public static async void SetUp()
        {
            // Set up an in-memory database for testing
            _options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            // Initialize the database context with the in-memory database
            _dbContext = new DatabaseContext(_options);

            // Seed the database with a user
            _dbContext.Users.Add(new User
            {
                Id = 1,
                Email = "test1@email.com",
                Forename = "test",
                Surname = "1",
                Password = "Password123!",
                Preference = new Preference()
                {
                    Id = 1,
                    UserId = 1,
                    Theme = "System",
                    Palette = "#000000"
                }
            });
            await _dbContext.SaveChangesAsync();

            _userMapper = new UserMapper(new MilestoneCalculatorHelper(_dbContext, new DateRangeCalculatorHelper()), new ReviewMapper());

            // Create the controller with the in-memory database context
            _controller = new UserController(_dbContext, _userMapper);
        }

        [Given(@"I enter the email ""(.*)""")]
        public void GivenIEnterTheEmail(string email)
        {
            _email = email;  // Save the email for use in later steps
        }

        [When(@"I call GetUser")]
        public async Task WhenICallGetUser()
        {
            _response = await _controller.GetUser(_email);
        }

        [Then(@"The status code should be 200")]
        public void ThenTheResponseShouldBeOk()
        {
            var result = (OkObjectResult)_response;
            Assert.AreEqual(result.StatusCode!, StatusCodes.Status200OK);
        }

        [Then(@"The status code should be 404")]
        public void ThenTheResponseShouldBeNotFound()
        {
            var result = (NotFoundObjectResult)_response;
            Assert.AreEqual(result.StatusCode!, StatusCodes.Status404NotFound);
        }

        [Then(@"The response should be ""(.*)""")]
        public void ThenTheResponseShouldBe(string message)
        {
            var result = (NotFoundObjectResult)_response;
            Assert.AreEqual(result.Value, message);
        }
    }
}
