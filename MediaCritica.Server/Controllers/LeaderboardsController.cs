using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LeaderboardsController(DatabaseContext databaseContext) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;

        [HttpGet(Name = "GetUserRankings")]
        [Route("[action]/{timeframe}")]
        public async Task<List<UserRankingModel>> GetUserRankings(string timeframe)
        {
            DateTime startDate = timeframe == "week" ? DateTime.Now.AddDays(-7) : timeframe == "month" ? DateTime.Now.AddMonths(-1) : DateTime.MinValue;

            var rankings = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Select(user => new UserRankingModel()
                {
                    Name = $"{user.Forename} {user.Surname}",
                    Reviews = user.Reviews.Where(review => review.Date >= startDate).Count(),
                    Timeframe = timeframe,
                })
                .Where(r => r.Reviews > 0)
                .OrderByDescending(r => r.Reviews)
                .Take(10)
                .ToListAsync();

            for (int i = 0; i < rankings.Count; i++)
            {
                rankings[i].Rank = i + 1;
            }

            return rankings;
        }

        [HttpGet(Name = "GetMediaTrends")]
        [Route("[action]/{timeframe}")]
        public async Task<List<MediaTrendModel>> GetMediaTrends(string timeframe)
        {
            DateTime startDate = timeframe == "week" ? DateTime.Now.AddDays(-7) : timeframe == "month" ? DateTime.Now.AddMonths(-1) : DateTime.MinValue;

            var userRankings = new List<MediaTrendModel>();

            return userRankings;
        }
    }
}
