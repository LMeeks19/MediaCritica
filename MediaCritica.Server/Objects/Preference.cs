namespace MediaCritica.Server.Objects
{
    public class Preference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public required string Theme { get; set; }
        public required string Palette { get; set; }

    }
}
