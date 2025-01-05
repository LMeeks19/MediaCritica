namespace MediaCritica.Server.Extensions
{
    public static class ListExtensions
    {
        public static void AddIfNotNull<T>(this List<T> list, T? detail) where T : class
        {
            if (detail != null) list.Add(detail);
        }

        public static double CalculateStandardDeviation(this List<double> scores)
        {
            if (scores == null || scores.Count == 0)
                return 0;

            double mean = scores.Average();
            double variance = scores.Sum(score => Math.Pow(score - mean, 2)) / scores.Count;
            return Math.Sqrt(variance);
        }
    }
}
