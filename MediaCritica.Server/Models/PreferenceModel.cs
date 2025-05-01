namespace MediaCritica.Server.Models
{
    public class PreferenceModel
    {
        public int Id { get; set; }
        public string Theme { get; set; }
        public string Palette { get; set; }
        public string Locale { get; set; }
        public string Timezone { get; set; }

    }
}
