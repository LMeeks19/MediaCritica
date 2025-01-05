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
                .Where(user => user.Reviews.Any(r => r.Date >= startDate && r.Date <= endDate))
                .OrderByDescending(user => user.Reviews.Count)
                    .ThenBy(user => user.Surname)
                        .ThenBy(user => user.Forename)
                .Select(user => new UserRankingModel()
                {
                    Name = $"{user.Forename} {user.Surname}",
                    Reviews = user.Reviews.Where(review => review.Date >= startDate && review.Date <= endDate).Count(),
                    Timeframe = timeframe,
                })
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
            (DateTime start, DateTime end) =
                timeframe == "week" ? _dateRangeCalculatorHelper.GetThisWeekRange() :
                timeframe == "month" ? _dateRangeCalculatorHelper.GetThisMonthRange() :
                timeframe == "year" ? _dateRangeCalculatorHelper.GetThisYearRange() :
                _dateRangeCalculatorHelper.GetAllTimeRange();

            var trends = new List<MediaTrendModel>();

            var media = await _databaseContext.Media
                .Include(media => media.Reviews)
                .Include(media => media.Backlogs)
                .ToListAsync();

            trends.AddIfNotNull(_trendCalculatorHelper.GetRisingStar(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetFallingStar(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetSurprise(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostReviewed(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetHighestRated(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetComeback(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostActiveGenre(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostBacklogged(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostUnfinished(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostAbandoned(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetFanFavourite(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetHiddenGem(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetDirectorsSpotlight(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetActorsSpotlight(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostAnticipated(media, start, end, timeframe));
            trends.AddIfNotNull(_trendCalculatorHelper.GetMostPolarising(media, start, end, timeframe));

            return trends;
        }
    }
}
