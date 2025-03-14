using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Helpers
{
    public class AuthenticationHelper(DatabaseContext databaseContext) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        public async Task<User?> AuthenticateUser(UserLoginModel userLoginModel)
        {
            var user = await GetUser(userLoginModel.Email);

            if (user == null || userLoginModel.Password != user.Password)
                return null;

            return user;
        }

        public async Task<User> GetUser(string? email = null, int? id = null)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Preference)
                .Include(u => u.Reviews)
                .Include(u => u.Backlogs)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Notifications)
                .SingleAsync(u => u.Email == email || u.Id == id);

            return user;
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
                Expiration = DateTime.UtcNow.AddDays(30)
            };

            await _databaseContext.AuthTokens.AddAsync(authToken);
            await _databaseContext.SaveChangesAsync();

            return authToken;
        }

        public async Task<AuthToken?> GetAuthToken(string token)
        {
            return await _databaseContext.AuthTokens.FirstOrDefaultAsync(t => t.Token == token);
        }

        public async Task<AuthToken> UpdateAuthToken(AuthToken authToken)
        {
            authToken.Expiration = DateTime.UtcNow.AddDays(30);
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
