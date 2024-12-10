using MediaCritica.Server.Enums;

namespace MediaCritica.Server.Models
{
    public class UpdateUserModel
    {
        public string Email { get; set; }
        public string Value { get; set; }
        public UpdateUserEnum Type  { get; set; }
    }
}
