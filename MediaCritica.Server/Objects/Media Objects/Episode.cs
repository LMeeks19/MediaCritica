namespace MediaCritica.Server.Objects
{
    public class Episode : Media
    {
        public int EpisodeNo { get; set; }
        public int SeasonNo { get; set; }
        public int SeasonId { get; set; }
        public bool IsFullyPopulated { get; set; } = false;

        public virtual Season Season { get; set; }
    }
}
