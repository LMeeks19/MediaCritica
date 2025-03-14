namespace MediaCritica.Server.Helpers
{
    public class Helpers(DateRangeCalculatorHelper dateRangeCalculatorHelper, DateTimeProviderHelper dateTimeProviderHelper, ExternalApiHelper externalApiHelper, InternalApiHelper internalApiHelper, MilestoneCalculatorHelper milestoneCalculatorHelper, TrendCalculatorHelper trendCalculatorHelper, AuthenticationHelper authenticationHelper) : IHelpers
    {
        public DateRangeCalculatorHelper DateRangeCalculatorHelper { get; set; } = dateRangeCalculatorHelper;
        public DateTimeProviderHelper DateTimeProviderHelper { get; set; } = dateTimeProviderHelper;
        public ExternalApiHelper ExternalApiHelper { get; set; } = externalApiHelper;
        public InternalApiHelper InternalApiHelper { get; set; } = internalApiHelper;
        public MilestoneCalculatorHelper MilestoneCalculatorHelper { get; set; } = milestoneCalculatorHelper;
        public TrendCalculatorHelper TrendCalculatorHelper { get; set; } = trendCalculatorHelper;
        public AuthenticationHelper AuthenticationHelper { get; set; } = authenticationHelper;
    }
}

