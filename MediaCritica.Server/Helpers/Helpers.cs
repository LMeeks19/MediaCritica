namespace MediaCritica.Server.Helpers
{
    public class Helpers(DateRangeCalculatorHelper dateRangeCalculatorHelper, ExternalApiHelper externalApiHelper, InternalApiHelper internalApiHelper, MilestoneCalculatorHelper milestoneCalculatorHelper, TrendCalculatorHelper trendCalculatorHelper, AuthenticationHelper authenticationHelper, ImageValidator imageValidator) : IHelpers
    {
        public DateRangeCalculatorHelper DateRangeCalculatorHelper { get; set; } = dateRangeCalculatorHelper;
        public ExternalApiHelper ExternalApiHelper { get; set; } = externalApiHelper;
        public InternalApiHelper InternalApiHelper { get; set; } = internalApiHelper;
        public MilestoneCalculatorHelper MilestoneCalculatorHelper { get; set; } = milestoneCalculatorHelper;
        public TrendCalculatorHelper TrendCalculatorHelper { get; set; } = trendCalculatorHelper;
        public AuthenticationHelper AuthenticationHelper { get; set; } = authenticationHelper;
        public ImageValidator ImageValidator { get; set; } = imageValidator;
    }
}

