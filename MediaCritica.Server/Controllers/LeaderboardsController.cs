using MediaCritica.Server.Extensions;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LeaderboardsController(DatabaseContext databaseContext, DateRangeCalculatorHelper dateRangeCalculatorHelper, TrendCalculatorHelper trendCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly DateRangeCalculatorHelper _dateRangeCalculatorHelper = dateRangeCalculatorHelper;
        private readonly TrendCalculatorHelper _trendCalculatorHelper = trendCalculatorHelper;

        [HttpGet(Name = "GetUserRankings")]
        [Route("[action]/{timeframe}")]
        public async Task<List<UserRankingModel>> GetUserRankings(string timeframe)
        {
            (DateTime startDate, DateTime endDate) =
                timeframe == "week" ? _dateRangeCalculatorHelper.GetThisWeekRange() :
                timeframe == "month" ? _dateRangeCalculatorHelper.GetThisMonthRange() :
                timeframe == "year" ? _dateRangeCalculatorHelper.GetThisYearRange() :
                _dateRangeCalculatorHelper.GetAllTimeRange();

            var rankings = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Select(user => new UserRankingModel()
                {
                    Name = $"{user.Forename} {user.Surname}",
                    Reviews = user.Reviews.Where(review => review.Date >= startDate && review.Date <= endDate).Count(),
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
        [Route("[action]")]
        public async Task<List<MediaTrendModel>> GetMediaTrends()
        {
            var timeframes = new[]
            {
                new { Label = "week", Range = _dateRangeCalculatorHelper.GetThisWeekRange() },
                new { Label = "month", Range = _dateRangeCalculatorHelper.GetThisMonthRange() },
                new { Label = "year", Range = _dateRangeCalculatorHelper.GetThisYearRange() },
            };

            var trends = new List<MediaTrendModel>();

            foreach (var timeframe in timeframes)
            {
                var (start, end) = timeframe.Range;

                trends.AddIfNotNull(await _trendCalculatorHelper.GetRisingStar(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetFallingStar(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetSurprise(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetMostReviewed(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetHighestRated(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetComeback(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetMostActiveGenre(start, end, timeframe.Label));
                trends.AddIfNotNull(await _trendCalculatorHelper.GetMostBacklogged(start, end, timeframe.Label));
            }

            return trends;
        }
    }
}
