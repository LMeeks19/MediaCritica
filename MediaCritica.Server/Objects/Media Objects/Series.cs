namespace MediaCritica.Server.Objects
{
    public class Series : Media
    {
        public int TotalSeasons { get; set; }
        public virtual List<Season> Seasons { get; set; }
    }
}
