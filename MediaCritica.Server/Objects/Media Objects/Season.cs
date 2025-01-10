namespace MediaCritica.Server.Objects
{
    public class Season
    {
        public int Id { get; set; }
        public string SeriesId { get; set; }
        public virtual Series Series { get; set; }
        public int SeasonNo { get; set; }
        public string Title { get; set; }
        public virtual List<Episode> Episodes { get; set; }
    }
}
