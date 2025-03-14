namespace MediaCritica.Server.Objects
{
    public class AuthToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
    }
}
