namespace MediaCritica.Server.Models
{
    public class UserModel
    {
        public int? Id { get; set; }
        public string? Forename { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public PreferenceModel? Preference { get; set; }
        public int TotalReviews { get; set; }
        public int TotalBacklogs { get; set; }
        public int TotalNotifications { get; set; }
        public int TotalFollowers { get; set; }
        public int TotalFollowing { get; set; }
    }
}
