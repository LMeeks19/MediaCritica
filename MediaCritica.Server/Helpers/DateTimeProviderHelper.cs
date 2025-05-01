using MediaCritica.Server.Models;
using System.Globalization;

namespace MediaCritica.Server.Helpers
{
    public interface IDateTimeProviderHelper
    {
        DateTime UtcNow { get; }
        string GetLocalDate(DateTime utcDateTime, PreferenceModel preference);
        string GetDateTimeDistance(DateTime utcDateTime, DateTime objectDateTime);
    }

    public class DateTimeProviderHelper : IDateTimeProviderHelper
    {
        public DateTime UtcNow => DateTime.UtcNow;

        public string GetLocalDate(DateTime utcDateTime, PreferenceModel preference)
        {
            TimeZoneInfo timezone = TimeZoneInfo.FindSystemTimeZoneById(preference.Timezone);
            DateTime localDate = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, timezone);
            CultureInfo culture = new(preference.Locale);

            return localDate.ToString("D", culture);
        }

        public string GetDateTimeDistance(DateTime utcDateTime, DateTime objectUtcDateTime)
        {
            TimeSpan timeDifference = utcDateTime - objectUtcDateTime;
            bool isPast = timeDifference.TotalSeconds >= 0;

            timeDifference = timeDifference.Duration();
            string timeUnit;
            int value;

            if (timeDifference.TotalSeconds < 60)
            {
                timeUnit = "second";

                if (timeDifference.Seconds == 0)
                    return isPast ? "just now" : "in a moment";

                value = timeDifference.Seconds;
            }
            else if (timeDifference.TotalMinutes < 60)
            {
                timeUnit = "minute";
                value = timeDifference.Minutes;
            }
            else if (timeDifference.TotalHours < 24)
            {
                timeUnit = "hour";
                value = timeDifference.Hours;
            }
            else if (timeDifference.TotalDays < 30)
            {
                timeUnit = "day";
                value = timeDifference.Days;
            }
            else if (timeDifference.TotalDays < 365)
            {
                timeUnit = "month";
                value = timeDifference.Days / 30;
            }
            else
            {
                timeUnit = "year";
                value = timeDifference.Days / 365;
            }

            string suffix = value == 1 ? "" : "s";
            return isPast
                ? $"{value} {timeUnit}{suffix} ago"
                : $"in {value} {timeUnit}{suffix}";
        }
    }
}
