namespace MediaCritica.Server.Helpers
{
    public interface IHelpers
    {
        DateRangeCalculatorHelper DateRangeCalculatorHelper { get; }
        DateTimeProviderHelper DateTimeProviderHelper { get; }
        ExternalApiHelper ExternalApiHelper { get; }
        InternalApiHelper InternalApiHelper { get; }
        MilestoneCalculatorHelper MilestoneCalculatorHelper { get; }
        TrendCalculatorHelper TrendCalculatorHelper { get; }
        AuthenticationHelper AuthenticationHelper { get; }
    }
}
