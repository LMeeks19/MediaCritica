namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportReasonModel
    {
        public int ReasonId { get; set; }
        public string ReasonText { get; set; }
        public List<ReportModel> Reports { get; set; }
        public int TotalReports { get; set; }
    }
}
