using MediaCritica.Server.Controllers;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class UserControllerSteps
    {
        private UserController _controller;
        private IActionResult _response;

        [BeforeScenario]
        public async Task BeforeScenario()
        {
            await GlobalSetup._dbContext.Users.AddAsync(new User
            {
                Id = 1,
                Email = "test1@email.com",
                Forename = "Test",
                Surname = "1",
                Password = "Password123!",
                Joined = DateOnly.Parse("2025-01-01"),
                Preference = new Preference()
                {
                    Id = 1,
                    UserId = 1,
                    Theme = "System",
                    Palette = "#000000"
                }
            });

            await GlobalSetup._dbContext.SaveChangesAsync();

            var userMapper = new UserMapper(new MilestoneCalculatorHelper(GlobalSetup._dbContext, new DateRangeCalculatorHelper()), new ReviewMapper());
            _controller = new UserController(GlobalSetup._dbContext, userMapper);
        }

        [AfterScenario]
        public async Task AfterScenario()
        {
            var users = await GlobalSetup._dbContext.Users.ToListAsync();
            GlobalSetup._dbContext.Users.RemoveRange(users);
            await GlobalSetup._dbContext.SaveChangesAsync();
        }

        [When(@"I call GetUser with the Email ""(.*)""")]
        public async Task WhenICallGetUserWithTheEmail(string email)
        {
            _response = await _controller.GetUser(email);
        }

        [When(@"I call DeleteUser with the Id (\d+)")]
        public async Task WhenICallDeleteUserWithTheId(int userId)
        {
            _response = await _controller.DeleteUser(userId);
        }

        [When(@"I call PostUser with the User")]
        public async Task WhenICallPostUserWithTheUser(Table table)
        {
            var user = table.CreateInstance<CreateUserModel>();
            _response = await _controller.PostUser(user);
        }

        [When(@"I call UpdateUser with the UpdateUserModel")]
        public async Task WhenICallUpdateUserWithTheUpdateUserModel(Table table)
        {
            var updateUserModel = table.CreateInstance<UpdateUserModel>();
            _response = await _controller.UpdateUser(updateUserModel);
        }

        [When(@"I call UpdateUserPreference with the PreferenceModel")]
        public async Task WhenICallUpdateUserPreferenceWithThePreferenceModel(Table table)
        {
            var preferenceModel = table.CreateInstance<PreferenceModel>();
            _response = await _controller.UpdateUserPreference(preferenceModel);
        }

        [When(@"I call GetViewUserSummary with the Id (\d+)")]
        public async Task WhenICallGetViewSummaryWithTheId(int userId)
        {
            _response = await _controller.GetUserSummary(userId);
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

        [Then(@"The UserModel response should be")]
        public void ThenTheUserModelResponseShouldBe(Table table)
        {
            var result = (OkObjectResult)_response;
            Assert.IsNotNull(result);
            var expectedUser = result.Value as UserModel;
            Assert.IsNotNull(expectedUser);

            var row = table.Rows[0];

            var actualUser = new UserModel
            {
                Id = int.Parse(row["Id"]),
                Forename = row["Forename"],
                Surname = row["Surname"],
                Email = row["Email"],
                Password = row["Password"],
                Preference = new PreferenceModel
                {
                    Id = int.Parse(row["PreferenceId"]),
                    Theme = row["Theme"],
                    Palette = row["Palette"]
                },
            };

            // Assert the user and preference properties
            Assert.AreEqual(actualUser.Id, expectedUser.Id);
            Assert.AreEqual(actualUser.Forename, expectedUser.Forename);
            Assert.AreEqual(actualUser.Surname, expectedUser.Surname);
            Assert.AreEqual(actualUser.Email, expectedUser.Email);
            Assert.AreEqual(actualUser.Password, expectedUser.Password);
            Assert.AreEqual(actualUser.Preference.Id, expectedUser.Preference.Id);
            Assert.AreEqual(actualUser.Preference.Theme, expectedUser.Preference.Theme);
            Assert.AreEqual(actualUser.Preference.Palette, expectedUser.Preference.Palette);
        }

        [Then(@"The PreferenceModel response should be")]
        public void ThenThePreferenceModelResponseShouldBe(Table table)
        {
            var result = (OkObjectResult)_response;
            Assert.IsNotNull(result);
            var expectedPreference = result.Value as PreferenceModel;
            Assert.IsNotNull(expectedPreference);

            var actualPreference = table.Rows[0].CreateInstance<PreferenceModel>();

            // Assert the user and preference properties
            Assert.AreEqual(actualPreference.Id, expectedPreference.Id);
            Assert.AreEqual(actualPreference.Theme, expectedPreference.Theme);
            Assert.AreEqual(actualPreference.Palette, expectedPreference.Palette);
        }

        [Then(@"The UserSummaryModel response should be")]
        public void TheUserSummaryModelResponseShouldBe(Table table)
        {
            var result = (OkObjectResult)_response;
            Assert.IsNotNull(result);
            var expectedUserSummary = result.Value as UserSummaryModel;
            Assert.IsNotNull(expectedUserSummary);

            var actualUserSummary = table.Rows[0].CreateInstance<UserSummaryModel>();
            actualUserSummary.Joined = DateOnly.Parse(table.Rows[0]["Joined"]);

            Assert.AreEqual(actualUserSummary.Id, expectedUserSummary.Id);
            Assert.AreEqual(actualUserSummary.Name, expectedUserSummary.Name);
            Assert.AreEqual(actualUserSummary.Joined, expectedUserSummary.Joined);
        }
    }
}
