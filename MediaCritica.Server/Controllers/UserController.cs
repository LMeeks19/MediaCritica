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
            var user = await _databaseContext.Users.SingleOrDefaultAsync(user => user.Email == email);

            return new UserModel { Email = user?.Email, Password = user?.Password };
        }

        [HttpPost(Name = "PostUser")]
        [Route("[action]")]
        public async Task<UserModel> PostUser([FromBody] UserModel userModel)
        {
            var user = new User { Email = userModel.Email!, Password = userModel.Password! };

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }

        [HttpPut(Name = "UpdateUser")]
        [Route("[action]")]
        public async Task<UserModel> UpdateUser([FromBody] UpdateUserModel updateUserModel)
        {
            var user = _databaseContext.Users.Single(user => user.Email == updateUserModel.Email);

            if (updateUserModel.Type == UpdateUserEnum.Email)
            {
                user.Email = updateUserModel.Value;
                var reviews = await _databaseContext.Reviews
                    .Where(review => review.ReviewerEmail == updateUserModel.Email)
                    .Select(review => review)
                    .ToListAsync();

                reviews.ForEach(review => review.ReviewerEmail = updateUserModel.Value);

                _databaseContext.Reviews.UpdateRange(reviews);

            }
            if (updateUserModel.Type == UpdateUserEnum.Password)
                user.Password = updateUserModel.Value;



            _databaseContext.Users.Update(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }
    }
}