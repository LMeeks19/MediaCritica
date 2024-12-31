namespace MediaCritica.Server.Models
{
    public class EpisodeModel : MediaModel
    {
        public string Episode { get; set; }
        public string Season { get; set; }
        public int SeasonId { get; set; }
    }
}
