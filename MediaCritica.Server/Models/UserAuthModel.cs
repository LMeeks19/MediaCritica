using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Models
{
    public class UserAuthModel
    {
        public AuthToken AuthToken { get; set; }
        public UserModel User { get; set; }
    }
}
