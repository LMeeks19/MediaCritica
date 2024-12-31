using MediaCritica.Server.Models.Media_Models;

namespace MediaCritica.Server.Objects.Media_Objects
{
    public class MediaSummaryModelResponse
    {
        public int TotalMediaCount { get; set; }
        public List<MediaSummaryModel> MediaSummaryModels { get; set; }
    }
}
