namespace MediaCritica.Server.Extensions
{
    public static class DateTimeExtensions
    {
        public static string GetDateWithSuffix(this DateTime dateTime, string format, string suffixPlaceHolder = "$", StringComparison comparisonType = StringComparison.Ordinal)
        {
            string suffix = dateTime.Day switch
            {
                1 or 21 or 31 => "st",
                2 or 22 => "nd",
                3 or 23 => "rd",
                _ => "th",
            };
            string text = format.Insert(format.LastIndexOf("d", comparisonType) + 1, suffixPlaceHolder);
            return dateTime.ToString(text).Replace(suffixPlaceHolder, suffix);
        }

        public static string GetDateByTimeFrame(this DateTime dateTime, string timeframe)
        {
            var formattedDate = timeframe switch
            {
                "week" => dateTime.ToString("dddd"),
                "month" => dateTime.GetDateWithSuffix("dddd d"),
                _ => dateTime.GetDateWithSuffix("dddd, MMMM d")
            };
            return formattedDate;
        }
    }
}
