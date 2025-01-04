namespace MediaCritica.Server.Helpers
{
    public class DateRangeCalculatorHelper
    {
        public (DateTime start, DateTime end) GetThisWeekRange()
        {
            DateTime currentDate = DateTime.Today;
            // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
            int dayOfWeek = (int)currentDate.DayOfWeek;
            DateTime startOfWeek = currentDate.AddDays(-dayOfWeek + (int)DayOfWeek.Monday); // Move back to Monday
            DateTime endOfWeek = startOfWeek.AddDays(7); // Add 6 days to get Sunday
            return (startOfWeek, endOfWeek);
        }

        public (DateTime start, DateTime end) GetThisMonthRange()
        {
            DateTime currentDate = DateTime.Today;
            DateTime startOfMonth = new(currentDate.Year, currentDate.Month, 1); // 1st day of the month
            DateTime endOfMonth = startOfMonth.AddMonths(1); // Last day of the month
            return (startOfMonth, endOfMonth);
        }

        public (DateTime start, DateTime end) GetThisYearRange()
        {
            DateTime currentDate = DateTime.Today;
            DateTime startOfYear = new(currentDate.Year, 1, 1); // Jan 1st of the year
            DateTime endOfYear = new(currentDate.Year + 1, 1, 1); // Dec 31st of the year
            return (startOfYear, endOfYear);
        }

        public (DateTime start, DateTime end) GetAllTimeRange()
        {
            DateTime startOfAllTime = DateTime.MinValue; // The earliest possible date
            DateTime endOfAllTime = DateTime.Today; // Current date
            return (startOfAllTime, endOfAllTime);
        }
    }
}
