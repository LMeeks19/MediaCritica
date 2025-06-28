namespace MediaCritica.Server.Models.ReportModels
{
    public class ReportReasonModel
    {
        public int Id { get; set; }
        public string Reason { get; set; }
        public List<ReportModel> Reports { get; set; }
        public int TotalReports => Reports.Count;
    }
}
