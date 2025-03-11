namespace MediaCritica.Server.Helpers
{
    public class DateTimeProviderHelper(DateTime? dateTime)
    {
        public DateTime Now = dateTime ?? DateTime.Now;
    }
}
