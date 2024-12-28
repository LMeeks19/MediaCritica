namespace MediaCritica.Server.Objects
{
    public class Episode : Media
    {
        public int EpisodeNo { get; set; }
        public int Season { get; set; }
        public int SeasonId { get; set; }
    }
}
