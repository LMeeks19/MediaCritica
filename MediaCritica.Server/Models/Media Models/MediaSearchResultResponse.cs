namespace MediaCritica.Server.Models
{
    public class MediaSearchResultResponse
    {
        public string response { get; set; }
        public List<MediaSearchModel> search { get; set; }
        public string totalResults { get; set; }
    }
}
