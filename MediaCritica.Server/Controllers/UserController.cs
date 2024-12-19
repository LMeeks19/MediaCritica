using MediaCritica.Server.Enums;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public UserController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        [HttpGet(Name = "GetUser")]
        [Route("[action]/{email}")]
        public async Task<UserModel> GetUser(string email)
        {
            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Include(user => user.Backlogs)
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
        public async Task<UserModel> PostUser([FromBody] UserModel userModel)
        {
            var user = new User
            {
                Forename = userModel.Forename!,
                Surname = userModel.Surname!,
                Email = userModel.Email!,
                Password = userModel.Password!
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
    }
}