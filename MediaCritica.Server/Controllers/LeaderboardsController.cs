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

        [HttpGet("[action]/{timeframe}")]
        public async Task<IActionResult> GetUserRankings(string timeframe)
        {
            (DateTime startDate, DateTime endDate) = timeframe switch
            {
                "week" => _dateRangeCalculatorHelper.GetThisWeekRange(),
                "month" => _dateRangeCalculatorHelper.GetThisMonthRange(),
                "year" => _dateRangeCalculatorHelper.GetThisYearRange(),
                _ => _dateRangeCalculatorHelper.GetAllTimeRange()
            };

            var rankings = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Where(user => user.Reviews.Any(r => r.Date >= startDate && r.Date <= endDate))
                .OrderByDescending(user => user.Reviews.Count(r => r.Date >= startDate && r.Date <= endDate))
                .ThenBy(user => user.Surname)
                .ThenBy(user => user.Forename)
                .Select(user => new UserRankingModel
                {
                    Name = $"{user.Forename} {user.Surname}",
                    Reviews = user.Reviews.Count(r => r.Date >= startDate && r.Date <= endDate),
                    Timeframe = timeframe
                })
                .Take(10)
                .ToListAsync();

            // Assign rankings
            for (int i = 0; i < rankings.Count; i++)
            {
                rankings[i].Rank = i + 1;
            }

            return Ok(rankings);
        }

        [HttpGet("[action]/{timeframe}")]
        public async Task<IActionResult> GetMediaTrends(string timeframe)
        {
            (DateTime startDate, DateTime endDate) = timeframe switch
            {
                "week" => _dateRangeCalculatorHelper.GetThisWeekRange(),
                "month" => _dateRangeCalculatorHelper.GetThisMonthRange(),
                "year" => _dateRangeCalculatorHelper.GetThisYearRange(),
                _ => _dateRangeCalculatorHelper.GetAllTimeRange()
            };

            var media = await _databaseContext.Media
                .Include(m => m.Reviews)
                .Include(m => m.Backlogs)
                .ToListAsync();

            var trends = new List<MediaTrendModel>();

            trends.AddIfNotNull(_trendCalculatorHelper.GetRisingStar(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetFallingStar(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetSurprise(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostReviewed(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetHighestRated(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetComeback(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostActiveGenre(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostBacklogged(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostUnfinished(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostAbandoned(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetHiddenGem(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetDirectorsSpotlight(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetActorsSpotlight(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostAnticipated(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostPolarising(media, startDate, endDate, timeframe));

            trends = [.. trends.OrderBy(trend => trend.AwardType)];
            return Ok(trends);
        }
    }
}
