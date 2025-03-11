namespace MediaCritica.Server.Models
{
    public class SeasonModel
    {
        public string SeriesId { get; set; }
        public string Season { get; set; }
        public string Title { get; set; }
        public List<EpisodeSummaryModel> Episodes { get; set; }
    }
}
