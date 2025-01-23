namespace MediaCritica.Server.Models
{
    public class UserFollowSummaryObjectModel
    {
        public int Count { get; set; }
        public List<UserFollowSummaryModel> Data { get; set; }
    }
}
