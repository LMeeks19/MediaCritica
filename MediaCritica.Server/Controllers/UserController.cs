using MediaCritica.Server.Enums;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(DatabaseContext databaseContext, IMappers mapper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;

        [HttpGet("[action]/{searchTerm}")]
        public IActionResult GetUsersBySearch(string searchTerm)
        {
            var userQuery = _databaseContext.Users
                .AsEnumerable()
                .Where(u => u.FullName.StartsWith(searchTerm, StringComparison.OrdinalIgnoreCase))
                .ToList();

            var users = userQuery
                .Take(20)
                .Select(u => _mapper.UserMapper
                .MapUserSearchModel(u))
                .ToList();

            if (users.Count == 0)
                return NotFound(new { Message = "No users found" });

            return Ok(users);

        }

        [HttpGet("[action]/{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Reviews)
                .Include(u => u.Backlogs)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Notifications)
                .SingleOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(_mapper.UserMapper.MapUserModel(user));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostUser([FromBody] CreateUserModel userModel)
        {
            var userExists = await _databaseContext.Users.AnyAsync(u => u.Email == userModel.Email);

            if (userExists)
                return Conflict(new { Message = "Email already in use" });

            var user = _mapper.UserMapper.MapUser(userModel);

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return await GetUser(user.Email);
        }

        [HttpDelete("[action]/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _databaseContext.Users
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            _databaseContext.Users.Remove(user);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "User deleted" });
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserModel updateUserModel)
        {
            var user = await _databaseContext.Users.SingleOrDefaultAsync(user => user.Id == updateUserModel.UserId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            switch (updateUserModel.Type)
            {
                case UpdateUserEnum.Forename:
                    user.Forename = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Surname:
                    user.Surname = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Email:
                    user.Email = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Password:
                    user.Password = updateUserModel.Value;
                    break;
                default:
                    return BadRequest(new { Message = "Invalid update type" });
            }

            _databaseContext.Users.Update(user);
            await _databaseContext.SaveChangesAsync();

            return await GetUser(user.Email);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUserPreference([FromBody] PreferenceModel preferenceModel)
        {
            var preference = await _databaseContext.Preferences.SingleOrDefaultAsync(p => p.Id == preferenceModel.Id);

            if (preference == null)
                return NotFound(new { Message = "Preference not found" });

            preference.Theme = preferenceModel.Theme;
            preference.Palette = preferenceModel.Palette;

            _databaseContext.Preferences.Update(preference);
            await _databaseContext.SaveChangesAsync();

            return Ok(preferenceModel);
        }

        [HttpGet("[action]/{userId}")]
        public async Task<IActionResult> GetUserSummary(int userId)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Backlogs)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Media)
                .Include(u => u.Milestones)
                .Include(u => u.Engagements)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(_mapper.UserMapper.MapUserSummaryModel(user));
        }
    }
}