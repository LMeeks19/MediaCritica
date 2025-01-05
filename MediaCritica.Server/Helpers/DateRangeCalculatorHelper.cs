namespace MediaCritica.Server.Helpers
{
    public class DateRangeCalculatorHelper
    {
        public (DateTime start, DateTime end) GetThisWeekRange()
        {
            DateTime currentDate = DateTime.Today;

            int daysSinceMonday = (int)currentDate.DayOfWeek - (int)DayOfWeek.Monday;
            daysSinceMonday = daysSinceMonday < 0 ? 6 : daysSinceMonday; // Back to current week monday

            DateTime startOfWeek = currentDate.AddDays(-daysSinceMonday); // Set back to current week monday
            DateTime endOfWeek = startOfWeek.AddDays(7); // Add 7 days to get to next monday
            return (startOfWeek, endOfWeek);
        }

        public (DateTime start, DateTime end) GetThisMonthRange()
        {
            DateTime currentDate = DateTime.Today;
            DateTime startOfMonth = new(currentDate.Year, currentDate.Month, 1); // 1st day of current month
            DateTime endOfMonth = startOfMonth.AddMonths(1); // 1st day of next month
            return (startOfMonth, endOfMonth);
        }

        public (DateTime start, DateTime end) GetThisYearRange()
        {
            DateTime currentDate = DateTime.Today;
            DateTime startOfYear = new(currentDate.Year, 1, 1); // Jan 1st of current year
            DateTime endOfYear = new(currentDate.Year + 1, 1, 1); // Jan 1st of next year
            return (startOfYear, endOfYear);
        }

        public (DateTime start, DateTime end) GetAllTimeRange()
        {
            DateTime startOfAllTime = DateTime.MinValue; // The earliest possible date
            DateTime endOfAllTime = DateTime.Now; // Current date
            return (startOfAllTime, endOfAllTime);
        }
    }
}
