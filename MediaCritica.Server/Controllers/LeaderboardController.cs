using MediaCritica.Server.Extensions;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LeaderboardController(DatabaseContext databaseContext, IHelpers helper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IHelpers _helper = helper;

        [HttpGet("[action]/{timeframe}")]
        public async Task<IActionResult> GetUserRankings(string timeframe)
        {
            (DateTime startDate, DateTime endDate) = timeframe switch
            {
                "week" => _helper.DateRangeCalculatorHelper.GetThisWeekRange(),
                "month" => _helper.DateRangeCalculatorHelper.GetThisMonthRange(),
                "year" => _helper.DateRangeCalculatorHelper.GetThisYearRange(),
                _ => _helper.DateRangeCalculatorHelper.GetAllTimeRange()
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
                "week" => _helper.DateRangeCalculatorHelper.GetThisWeekRange(),
                "month" => _helper.DateRangeCalculatorHelper.GetThisMonthRange(),
                "year" => _helper.DateRangeCalculatorHelper.GetThisYearRange(),
                _ => _helper.DateRangeCalculatorHelper.GetAllTimeRange()
            };

            var media = await _databaseContext.Media
                .Include(m => m.Reviews)
                .Include(m => m.Backlogs)
                .ToListAsync();

            var trends = new List<MediaTrendModel>();

            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetRisingStar(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetFallingStar(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetSurprise(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostReviewed(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetHighestRated(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetComeback(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostActiveGenre(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostBacklogged(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostUnfinished(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostAbandoned(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetHiddenGem(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetDirectorsSpotlight(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetActorsSpotlight(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostAnticipated(media, startDate, endDate, timeframe));
            trends.AddIfNotNull(_helper.TrendCalculatorHelper.GetMostPolarising(media, startDate, endDate, timeframe));

            trends = [.. trends.OrderBy(trend => trend.AwardType)];
            return Ok(trends);
        }
    }
}
