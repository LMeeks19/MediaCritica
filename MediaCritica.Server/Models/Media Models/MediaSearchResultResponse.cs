namespace MediaCritica.Server.Models
{
    public class MediaSearchResultResponse
    {
        public string Response { get; set; }
        public List<MediaSearchModel> Search { get; set; }
        public string totalResults { get; set; }
    }
}
