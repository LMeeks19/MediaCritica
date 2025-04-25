using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, IDateTimeProviderHelper dateTimeProviderHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpPost("[action]")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel userLoginModel)
        {
            var user = await _helper.AuthenticationHelper.AuthenticateUser(userLoginModel);

            if (user == null)
                return Unauthorized(new { Message = "Invalid Credentials" });

            await _helper.AuthenticationHelper.SetUserId(user.Id);

            var authToken = userLoginModel.RememberMe ? await _helper.AuthenticationHelper.GenerateAuthToken(user.Id) : null;

            return Ok(new UserAuthModel
            {
                AuthToken = authToken,
                User = _mapper.UserMapper.MapUserModel(user),
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AutoLogin([FromBody] TokenModel tokenModel)
        {
            var authToken = await _helper.AuthenticationHelper.GetAuthToken(tokenModel.Token);

            if (authToken == null)
                return Unauthorized(new { Message = "Auto Login Failed" });

            if (_helper.AuthenticationHelper.HasTokenExpired(authToken))
            {
                _helper.AuthenticationHelper.RemoveAuthToken(authToken.Id);
                return Unauthorized(new { Message = "Authentication Expired" });
            }

            authToken = await _helper.AuthenticationHelper.UpdateAuthToken(authToken);

            var user = await _helper.AuthenticationHelper.GetUser(id: authToken.UserId);

            if (user == null)
                return Unauthorized(new { Message = "Auto Login Failed" });

            await _helper.AuthenticationHelper.SetUserId(user.Id);

            return Ok(new UserAuthModel
            {
                AuthToken = authToken,
                User = _mapper.UserMapper.MapUserModel(user)
            });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Logout([FromBody] TokenModel tokenModel)
        {
            var authToken = await _helper.AuthenticationHelper.GetAuthToken(tokenModel.Token);

            if (authToken != null)
            {
                _databaseContext.AuthTokens.Remove(authToken);
                await _databaseContext.SaveChangesAsync();
            }

            await _helper.AuthenticationHelper.UnSetUserId();

            return Ok(new { Message = "User Logged Out" });
        }

        [HttpGet("[action]/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Reviews)
                .Include(u => u.Backlogs)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Notifications)
                .SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            return Ok(_mapper.UserMapper.MapUserModel(user));
        }

        [HttpGet("[action]/{searchTerm}")]
        public async Task<IActionResult> GetUsersBySearch(string searchTerm)
        {
            var preference = await _helper.InternalApiHelper.GetUserPreference(_helper.AuthenticationHelper.GetUserId());

            var userQuery = _databaseContext.Users
                .AsEnumerable()
                .Where(u => u.Username.StartsWith(searchTerm, StringComparison.OrdinalIgnoreCase))
                .ToList();

            var users = userQuery
                .Take(20)
                .Select(u => _mapper.UserMapper.MapUserSearchModel(u, preference, _dateTimeProviderHelper))
                .OrderByDescending(u => u.Username)
                .ToList();

            if (users.Count == 0)
                return NotFound(new { Message = "No users found" });

            return Ok(users);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostUser([FromBody] CreateUserModel userModel)
        {
            var usernameExists = await _databaseContext.Users.AnyAsync(u => u.Username == userModel.Username);

            if (usernameExists)
                return Conflict(new { Message = "Username already in use" });

            var emailExists = await _databaseContext.Users.AnyAsync(u => u.Email == userModel.Email);

            if (emailExists)
                return Conflict(new { Message = "Email already in use" });

            var response = _helper.AuthenticationHelper.IsValidPassword(userModel.Password);
            if (!response.IsValid)
                return BadRequest(new { response.Message });

            userModel.Password = _helper.AuthenticationHelper.HashPassword(userModel.Password);
            var user = _mapper.UserMapper.MapUser(userModel, _dateTimeProviderHelper);

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Account Created" });
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteUser()
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
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
            var userId = _helper.AuthenticationHelper.GetUserId();
            var user = await _databaseContext.Users.SingleOrDefaultAsync(user => user.Id == userId);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            switch (updateUserModel.Type)
            {
                case UpdateUserEnum.Username:
                    if (await _databaseContext.Users.AnyAsync(u => u.Username == updateUserModel.Value))
                        return Conflict(new { Message = "Username already in use" });
                    user.Username = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Forename:
                    user.Forename = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Surname:
                    user.Surname = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Email:
                    if (await _databaseContext.Users.AnyAsync(u => u.Email == updateUserModel.Value))
                        return Conflict(new { Message = "Email already in use" });
                    user.Email = updateUserModel.Value;
                    break;
                case UpdateUserEnum.Password:
                    var response = _helper.AuthenticationHelper.IsValidPassword(updateUserModel.Value, user.Password);
                    if (!response.IsValid)
                        return BadRequest(new { response.Message });
                    user.Password = _helper.AuthenticationHelper.HashPassword(updateUserModel.Value);
                    break;
                default:
                    return BadRequest(new { Message = "Invalid update type" });
            }

            await _databaseContext.SaveChangesAsync();

            return await GetUserByUsername(user.Username);
        }


        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateUserPreference([FromBody] PreferenceModel preferenceModel)
        {
            var preference = await _databaseContext.Preferences.SingleOrDefaultAsync(p => p.Id == preferenceModel.Id);

            if (preference == null)
                return NotFound(new { Message = "Preference not found" });

            preference.Theme = preferenceModel.Theme;
            preference.Palette = preferenceModel.Palette;
            preference.Locale = preferenceModel.Locale;
            preference.Timezone = preferenceModel.Timezone;

            await _databaseContext.SaveChangesAsync();

            return Ok(preferenceModel);
        }

        [HttpGet("[action]/{username}")]
        public async Task<IActionResult> GetUserSummary(string username)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Backlogs)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Media)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Comments)
                .Include(u => u.Milestones)
                .Include(u => u.Engagements)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .SingleOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound(new { Message = "User not found" });

            var preference = await _helper.InternalApiHelper.GetUserPreference(_helper.AuthenticationHelper.GetUserId());

            return Ok(_mapper.UserMapper.MapUserSummaryModel(user, preference, _dateTimeProviderHelper));
        }
    }
}