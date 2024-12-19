namespace MediaCritica.Server.Models
{
    public class CreateUserModel
    {
        public required string Forename { get; set; }
        public required string Surname { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
