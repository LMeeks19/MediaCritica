using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using TechTalk.SpecFlow;
using TechTalk.SpecFlow.Assist;

namespace MediaCritica.Server.Testing.Steps
{
    [Binding]
    public class UserControllerSteps
    {
        [When(@"I call Login with the following details")]
        public async void WhenICallLoginWithTheFollowingDetails(Table table)
        {
            var userLoginModel = table.Rows[0].CreateInstance<UserLoginModel>();
            GlobalSteps._response = await GlobalSteps._controller.UserController.Login(userLoginModel);
        }

        [When(@"I call AutoLogin with the token ""(.*)""")]
        public async void WhenICallAutoLoginWithTheToken(string token)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.AutoLogin(new TokenModel { Token = token });
        }

        [When(@"I call Logout with token ""(.*)""")]
        public async void WhenICallLogoutWithToken(string token)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.Logout(new TokenModel { Token = token });
        }

        [When(@"I call GetUsersBySearch with search term ""(.*)""")]
        public void WhenICallGetUsersBySearchWithSearchTerm(string searchTerm)
        {
            GlobalSteps._response = GlobalSteps._controller.UserController.GetUsersBySearch(searchTerm);
        }

        [When(@"I call GetUser with the username ""(.*)""")]
        public async Task WhenICallGetUserWithTheEmail(string username)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.GetUserByUsername(username);
        }

        [When(@"I call DeleteUser")]
        public async Task WhenICallDeleteUser()
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.DeleteUser();
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

        [When(@"I call GetViewUserSummary with the username (.*)")]
        public async Task WhenICallGetViewSummary(string username)
        {
            GlobalSteps._response = await GlobalSteps._controller.UserController.GetUserSummary(username);
        }

        [Then(@"The UserAuthModel response should be")]
        public void ThenTheUserAuthModelResponseShouldBe(Table table)
        {
            var row = table.Rows[0];
            UserModel user = new()
            {
                Id = int.Parse(row["UserId"]),
                Forename = row["Forename"],
                Surname = row["Surname"],
                Email = row["Email"],
            };

            AuthToken? authToken = null;
            if (!string.IsNullOrEmpty(row["AuthTokenId"]))
            {
                authToken = new AuthToken
                {
                    Id = int.Parse(row["AuthTokenId"]),
                    UserId = int.Parse(row["AuthUserId"]),
                    Token = table.Header.Contains("Token") ? row["Token"] : null,
                    Expiration = DateTime.Parse(row["Expiration"]),
                };
            }

            var expectedAuthModel = new UserAuthModel
            {
                AuthToken = authToken,
                User = user
            };

            var result = (OkObjectResult)GlobalSteps._response;
            Assert.IsNotNull(result);
            var actualUserAuthModel = result.Value as UserAuthModel;
            Assert.IsNotNull(actualUserAuthModel);

            Assert.AreEqual(expectedAuthModel.AuthToken?.Id, actualUserAuthModel.AuthToken?.Id);
            Assert.AreEqual(expectedAuthModel.AuthToken?.UserId, actualUserAuthModel.AuthToken?.UserId);
            Assert.AreEqual(expectedAuthModel.AuthToken?.Expiration, actualUserAuthModel.AuthToken?.Expiration);
            if (table.Header.Contains("Token"))
                Assert.AreEqual(expectedAuthModel.AuthToken?.Token, actualUserAuthModel.AuthToken?.Token);

            Assert.AreEqual(expectedAuthModel.User.Id, actualUserAuthModel.User.Id);
            Assert.AreEqual(expectedAuthModel.User.Forename, actualUserAuthModel.User.Forename);
            Assert.AreEqual(expectedAuthModel.User.Surname, actualUserAuthModel.User.Surname);
            Assert.AreEqual(expectedAuthModel.User.Email, actualUserAuthModel.User.Email);
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
                Username = row["Username"],
                Forename = row["Forename"],
                Surname = row["Surname"],
                Email = row["Email"],
                Preference = new PreferenceModel
                {
                    Id = int.Parse(row["PreferenceId"]),
                    Theme = row["Theme"],
                    Palette = row["Palette"]
                },
            };

            Assert.AreEqual(actualUser.Id, expectedUser.Id);
            Assert.AreEqual(actualUser.Username, expectedUser.Username);
            Assert.AreEqual(actualUser.Forename, expectedUser.Forename);
            Assert.AreEqual(actualUser.Surname, expectedUser.Surname);
            Assert.AreEqual(actualUser.Email, expectedUser.Email);
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
            Assert.AreEqual(actualUserSummary.Username, expectedUserSummary.Username);
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
                Assert.AreEqual(expectedUserSearchModel.Username, actualUserSearchModel.Username);
                Assert.AreEqual(expectedUserSearchModel.Joined, actualUserSearchModel.Joined);
            }
        }
    }
}
