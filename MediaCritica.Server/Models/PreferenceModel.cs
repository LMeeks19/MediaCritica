namespace MediaCritica.Server.Models
{
    public class PreferenceModel
    {
        public required int Id { get; set; }
        public required string Theme { get; set; }
        public required string Palette { get; set; }
        public required string Locale { get; set; }
        public required string Timezone { get; set; }

    }
}
