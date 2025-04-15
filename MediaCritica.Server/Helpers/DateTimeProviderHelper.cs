using System.Globalization;

namespace MediaCritica.Server.Helpers
{
    public interface IDateTimeProviderHelper
    {
        DateTime UtcNow { get; }
        DateTime FormatDateTime(DateTime utcDate, string timezoneId, string locale);
    }

    public class DateTimeProviderHelper : IDateTimeProviderHelper
    {
        public DateTime UtcNow => DateTime.UtcNow;

        public DateTime FormatDateTime(DateTime utcDateTime, string timezoneId, string locale)
        {
            TimeZoneInfo timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
            DateTime localDate = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);

            CultureInfo culture = new(locale);
            return DateTime.Parse(localDate.ToString("F", culture));
        }
    }
}
