namespace MediaCritica.Server.Helpers
{
    public class DateRangeCalculatorHelper(IDateTimeProviderHelper dateTimeProviderHelper)
    {
        private IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        public (DateTime start, DateTime end) GetThisWeekRange()
        {
            DateTime currentDate = _dateTimeProviderHelper.Now.Date;

            int daysSinceMonday = (int)currentDate.DayOfWeek - (int)DayOfWeek.Monday;
            daysSinceMonday = daysSinceMonday < 0 ? 6 : daysSinceMonday; // Back to current week monday

            DateTime startOfWeek = currentDate.AddDays(-daysSinceMonday); // Set back to current week monday
            DateTime endOfWeek = startOfWeek.AddDays(7); // Add 7 days to get to next monday
            return (startOfWeek, endOfWeek);
        }

        public (DateTime start, DateTime end) GetThisMonthRange()
        {
            DateTime currentDate = _dateTimeProviderHelper.Now.Date;

            DateTime startOfMonth = new(currentDate.Year, currentDate.Month, 1); // 1st day of current month
            DateTime endOfMonth = startOfMonth.AddMonths(1); // 1st day of next month
            return (startOfMonth, endOfMonth);
        }

        public (DateTime start, DateTime end) GetThisYearRange()
        {
            DateTime currentDate = _dateTimeProviderHelper.Now.Date;

            DateTime startOfYear = new(currentDate.Year, 1, 1); // Jan 1st of current year
            DateTime endOfYear = new(currentDate.Year + 1, 1, 1); // Jan 1st of next year
            return (startOfYear, endOfYear);
        }

        public (DateTime start, DateTime end) GetAllTimeRange()
        {
            DateTime startOfAllTime = DateTime.MinValue; // The earliest possible date
            DateTime endOfAllTime = _dateTimeProviderHelper.Now; // Current date
            return (startOfAllTime, endOfAllTime);
        }

        public (int startMonth, int endMonth) GetSeasonMonths(int currentMonth)
        {
            return currentMonth switch
            {
                >= 12 or <= 2 => (12, 2),
                >= 3 and <= 5 => (3, 5),
                >= 6 and <= 8 => (6, 8),
                _ => (9, 11)
            };
        }
    }
}
