using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(DatabaseContext databaseContext, MilestoneCalculatorHelper milestoneCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;

        [HttpGet(Name = "GetUser")]
        [Route("[action]/{email}")]
        public async Task<UserModel> GetUser(string email)
        {
            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Include(user => user.Backlogs)
                .Include(user => user.Preference)
                .SingleOrDefaultAsync(user => user.Email == email);

            if (user == null)
            {
                return new UserModel
                {
                    Id = null,
                    Forename = null,
                    Surname = null,
                    Email = null,
                    Password = null,
                    Preference = { },
                    BacklogSummary = [],
                    TotalReviews = 0,
                    TotalBacklogs = 0
                };
            }

            return new UserModel
            {
                Id = user.Id,
                Forename = user.Forename,
                Surname = user.Surname,
                Email = user.Email,
                Password = user.Password,
                Preference = new PreferenceModel()
                {
                    Id = user.Preference.Id,
                    Theme = user.Preference.Theme,
                    Palette = user.Preference.Palette,
                },
                BacklogSummary = user.Backlogs.Select(backlogSummary => new BacklogSummaryModel()
                {
                    Id = backlogSummary.Id,
                    MediaId = backlogSummary.MediaId,
                }).ToList() ?? [],
                TotalReviews = user.Reviews.Count,
                TotalBacklogs = user.Backlogs.Count
            };
        }

        [HttpPost(Name = "PostUser")]
        [Route("[action]")]
        public async Task<UserModel> PostUser([FromBody] CreateUserModel userModel)
        {
            var user = new User
            {
                Forename = userModel.Forename,
                Surname = userModel.Surname,
                Email = userModel.Email,
                Password = userModel.Password,
                Preference = new Preference()
                {
                    Theme = "System",
                    Palette = "#971212"
                },
                Milestones = _milestoneCalculatorHelper.CreateMilestones()
            };

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }

        [HttpPut(Name = "UpdateUser")]
        [Route("[action]")]
        public async Task<UserModel> UpdateUser([FromBody] UpdateUserModel updateUserModel)
        {
            var user = _databaseContext.Users.Single(user => user.Id == updateUserModel.UserId);

            if (updateUserModel.Type == UpdateUserEnum.Forename)
                user.Forename = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Surname)
                user.Surname = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Email)
                user.Email = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Password)
                user.Password = updateUserModel.Value;

            _databaseContext.Users.Update(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }

        [HttpPut(Name = "UpdateUserPreference")]
        [Route("[action]")]
        public async Task<PreferenceModel> UpdateUserPreference([FromBody] PreferenceModel preferenceModel)
        {
            var preference = _databaseContext.Preferences.Single(p => p.Id == preferenceModel.Id);

            preference.Theme = preferenceModel.Theme;
            preference.Palette = preferenceModel.Palette;

            _databaseContext.Preferences.Update(preference);
            await _databaseContext.SaveChangesAsync();

            return new PreferenceModel()
            {
                Id = preference.Id,
                Theme = preference.Theme,
                Palette = preference.Palette
            };
        }

        [HttpDelete(Name = "DeleteUser")]
        [Route("[action]/{userId}")]
        public async Task<bool> DeleteUser(int userId)
        {
            var user = _databaseContext.Users
                .Include(user => user.Preference)
                .Include(user => user.Reviews)
                .Include(user => user.Backlogs)
                .Single(user => user.Id == userId);

            _databaseContext.Users.Remove(user);
            await _databaseContext.SaveChangesAsync();

            return true;
        }
    }
}