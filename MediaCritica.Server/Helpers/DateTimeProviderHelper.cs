namespace MediaCritica.Server.Helpers
{
    public interface IDateTimeProviderHelper
    {
        DateTime UtcNow { get; }
    }

    public class DateTimeProviderHelper : IDateTimeProviderHelper
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}
