namespace MediaCritica.Server.Extensions
{
    public static class ListExtensions
    {
        public static void AddIfNotNull<T>(this List<T> list, T? detail) where T : class
        {
            if (detail != null) list.Add(detail);
        }
    }
}
