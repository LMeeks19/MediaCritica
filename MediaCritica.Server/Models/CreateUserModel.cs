namespace MediaCritica.Server.Models
{
    public class CreateUserModel
    {
        public string Username { get; set; }
        public string Forename { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Locale { get; set; }
        public string Timezone { get; set; }
    }
}
