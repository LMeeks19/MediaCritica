using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class UserControllerSteps
    {
        [When(@"I call GetUsersBySearch with search term ""(.*)""")]
        public void WhenICallGetUsersBySearchWithSearchTerm(string searchTerm)
        {
            GlobalSteps._response = GlobalSteps._controller.UserController.GetUsersBySearch(searchTerm);
        }

        [When(@"I call GetUser with the Email ""(.*)""")]
        public async Task WhenICallGetUserWithTheEmail(string email)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.GetUser(email);
        }

        [When(@"I call DeleteUser with the Id (\d+)")]
        public async Task WhenICallDeleteUserWithTheId(int userId)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.DeleteUser(userId);
        }

        [When(@"I call PostUser with the User")]
        public async Task WhenICallPostUserWithTheUser(Table table)
        {
            var user = table.CreateInstance<CreateUserModel>();
            GlobalSteps._response = await GlobalSteps._controller.UserController.PostUser(user);
        }

        [When(@"I call UpdateUser with the UpdateUserModel")]
        public async Task WhenICallUpdateUserWithTheUpdateUserModel(Table table)
        {
            var updateUserModel = table.CreateInstance<UpdateUserModel>();
            GlobalSteps._response = await GlobalSteps._controller.UserController.UpdateUser(updateUserModel);
        }

        [When(@"I call UpdateUserPreference with the PreferenceModel")]
        public async Task WhenICallUpdateUserPreferenceWithThePreferenceModel(Table table)
        {
            var preferenceModel = table.CreateInstance<PreferenceModel>();
            GlobalSteps._response = await GlobalSteps._controller.UserController.UpdateUserPreference(preferenceModel);
        }

        [When(@"I call GetViewUserSummary with the Id (\d+)")]
        public async Task WhenICallGetViewSummaryWithTheId(int userId)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.GetUserSummary(userId);
        }

        [Then(@"The UserModel response should be")]
        public void ThenTheUserModelResponseShouldBe(Table table)
        {
            var result = (OkObjectResult)GlobalSteps._response;
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
            var result = (OkObjectResult)GlobalSteps._response;
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
            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var expectedUserSummary = result.Value as UserSummaryModel;
            Assert.IsNotNull(expectedUserSummary);

            var actualUserSummary = table.Rows[0].CreateInstance<UserSummaryModel>();
            actualUserSummary.Joined = DateOnly.Parse(table.Rows[0]["Joined"]);

            Assert.AreEqual(actualUserSummary.Id, expectedUserSummary.Id);
            Assert.AreEqual(actualUserSummary.Name, expectedUserSummary.Name);
            Assert.AreEqual(actualUserSummary.Joined, expectedUserSummary.Joined);
        }

        [Then(@"The UserSearchModels should be")]
        public void ThenTheUserSearchModelsShouldBe(Table table)
        {
            var expectedUserSearchModels = table.CreateSet<UserSearchModel>().ToList();

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualUserSummaryModels = result.Value as List<UserSearchModel>;
            Assert.AreEqual(expectedUserSearchModels.Count(), actualUserSummaryModels.Count);

            for (int i = 0; i < expectedUserSearchModels.Count(); i++)
            {
                var expectedUserSearchModel = expectedUserSearchModels[i];
                var actualUserSearchModel = actualUserSummaryModels[i];

                Assert.AreEqual(expectedUserSearchModel.Id, actualUserSearchModel.Id);
                Assert.AreEqual(expectedUserSearchModel.FullName, actualUserSearchModel.FullName);
                Assert.AreEqual(expectedUserSearchModel.Joined, actualUserSearchModel.Joined);
            }
        }
    }
}
