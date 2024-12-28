namespace MediaCritica.Server.Objects
{
    public class Season
    {
        public int Id { get; set; }
        public int SeriesId { get; set; }
        public int SeasonNo { get; set; }
        public string Title { get; set; }
        public virtual List<Media> Episodes { get; set; }
    }
}
