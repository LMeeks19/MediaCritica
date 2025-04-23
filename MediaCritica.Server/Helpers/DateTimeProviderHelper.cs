namespace MediaCritica.Server.Helpers
{
    public interface IDateTimeProviderHelper
    {
        DateTime UtcNow { get; }
        DateTime GetLocalDateTime(DateTime utcDateTime, string timezoneId);
    }

    public class DateTimeProviderHelper : IDateTimeProviderHelper
    {
        public DateTime UtcNow => DateTime.UtcNow;

        public DateTime GetLocalDateTime(DateTime utcDateTime, string timezoneId)
        {
            TimeZoneInfo timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
            DateTime localDate = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);

            return localDate;
        }
    }
}
