using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using MediaCritica.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ConsoleCatalog.Internal_Server.Controllers
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
            var user = await _databaseContext.Users.SingleAsync(user => user.Email == email);
            
            return new UserModel { Email = user.Email, Password = user.Password };
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
    }
}
