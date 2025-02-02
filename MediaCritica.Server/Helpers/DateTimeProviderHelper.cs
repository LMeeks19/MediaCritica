namespace MediaCritica.Server.Helpers
{
    public interface IDateTimeProviderHelper
    {
        DateTime Now { get; }
    }

    public class DateTimeProviderHelper : IDateTimeProviderHelper
    {
        public DateTime Now => DateTime.Now;
    }
}
