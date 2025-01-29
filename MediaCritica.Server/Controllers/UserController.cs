using MediaCritica.Server.Enums;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(DatabaseContext databaseContext, UserMapper userMapper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly UserMapper _userMapper = userMapper;

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
                return NotFound("User not found");

            return Ok(_userMapper.MapUserModel(user));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostUser([FromBody] CreateUserModel userModel)
        {
            var user = _userMapper.MapUser(userModel);

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return await GetUser(user.Email);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserModel updateUserModel)
        {
            var user = await _databaseContext.Users.SingleOrDefaultAsync(user => user.Id == updateUserModel.UserId);

            if (user == null)
                return NotFound();

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
                    return BadRequest("Invalid update type");
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
                return NotFound("Preference not found");

            preference.Theme = preferenceModel.Theme;
            preference.Palette = preferenceModel.Palette;

            _databaseContext.Preferences.Update(preference);
            await _databaseContext.SaveChangesAsync();

            return Ok(new PreferenceModel
            {
                Id = preference.Id,
                Theme = preference.Theme,
                Palette = preference.Palette
            });
        }

        [HttpDelete("[action]/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _databaseContext.Users
                .SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found");

            _databaseContext.Users.Remove(user);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("[action]/{userId}")]
        public async Task<IActionResult> GetViewUserSummary(int userId)
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
                return NotFound("User not found");

            return Ok(_userMapper.MapViewUserSummaryModel(user));
        }
    }
}