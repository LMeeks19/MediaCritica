using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace MediaCritica.Server.Helpers
{
    public class AuthenticationHelper(DatabaseContext databaseContext, IDateTimeProviderHelper dateTimeProviderHelper, IHttpContextAccessor httpContextAccessor, bool isTestEnvironment = false) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;
        private readonly HttpContext _httpContext = httpContextAccessor.HttpContext;
        private readonly bool _isTestEnvironment = isTestEnvironment;

        public async Task<User?> AuthenticateUser(UserLoginModel userLoginModel)
        {
            var user = await GetUser(userLoginModel.Username);

            if (user == null || userLoginModel.Password != user.Password)
                return null;

            return user;
        }

        public PasswordValidationResultModel IsValidPassword(string newPassword, string oldPassword)
        {
            if (newPassword == oldPassword)
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must be the same as the existing password" };
            else if (newPassword.Length < 8)
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must be at least 8 characters long" };
            else if (!Regex.IsMatch(newPassword, @"^[a-zA-Z].*"))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must start with a letter" };
            else if (!newPassword.Any(char.IsDigit))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must contain at least one digit" };
            else if (!newPassword.Any(char.IsUpper))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must contain at least one uppercase letter" };
            else if (!newPassword.Any(char.IsLower))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must contain at least one lowercase letter" };
            else if (!Regex.IsMatch(newPassword, @".*[!""#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~].*"))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must contain at least one symbol" };
            else if (newPassword.Contains(' '))
                return new PasswordValidationResultModel { IsValid = false, Message = "Password must not contain spaces" };

            return new PasswordValidationResultModel { IsValid = true };
        }

        public async Task<User?> GetUser(string? username = null, int? id = null)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Reviews)
                .Include(u => u.Backlogs)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Notifications)
                .SingleOrDefaultAsync(u => u.Username == username || u.Id == id);

            return user;
        }

        public async Task SetUserId(int userId)
        {
            var claims = new List<Claim> { new(ClaimTypes.Name, userId.ToString()) };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            if (_isTestEnvironment)
                _httpContext.User = claimsPrincipal;
            else
                await _httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);
        }

        public int? GetUserId()
        {
            try { return int.Parse(_httpContext.User.Identity.Name); }
            catch { return null; }
        }

        public async Task UnSetUserId()
        {
            if (_isTestEnvironment)
                _httpContext.User = null;
            else
                await _httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public async Task<AuthToken> GenerateAuthToken(int userId)
        {
            var uniqueToken = false;
            var token = "";

            while (!uniqueToken)
            {
                token = Guid.NewGuid().ToString();

                if (!_databaseContext.AuthTokens.Any(a => a.Token == token))
                    uniqueToken = true;
            }

            var authToken = new AuthToken()
            {
                UserId = userId,
                Token = token,
                Expiration = _dateTimeProviderHelper.UtcNow.AddDays(30)
            };

            await _databaseContext.AuthTokens.AddAsync(authToken);
            await _databaseContext.SaveChangesAsync();

            return authToken;
        }

        public bool HasTokenExpired(AuthToken authToken)
        {
            return _dateTimeProviderHelper.UtcNow > authToken.Expiration;
        }

        public async Task<AuthToken?> GetAuthToken(string token)
        {
            return await _databaseContext.AuthTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task<AuthToken> UpdateAuthToken(AuthToken authToken)
        {
            authToken.Expiration = _dateTimeProviderHelper.UtcNow.AddDays(30);
            await _databaseContext.SaveChangesAsync();

            return authToken;
        }

        public async void RemoveAuthToken(int authTokenId)
        {
            var authToken = await _databaseContext.AuthTokens.FindAsync(authTokenId);
            if (authToken != null)
            {
                _databaseContext.AuthTokens.Remove(authToken);
                await _databaseContext.SaveChangesAsync();
            }
        }
    }
}
