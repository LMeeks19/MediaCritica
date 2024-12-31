namespace MediaCritica.Server.Models
{
    public class SeriesModel : MediaModel
    {
        public string totalSeasons { get; set; }
        public List<SeasonModel> Seasons { get; set; } = [];
        public List<ReviewSummaryModel> Reviews { get; set; } = [];

    }
}
