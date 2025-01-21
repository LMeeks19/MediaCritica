namespace MediaCritica.Server.Models
{
    public class UserReviewsModelObject
    {
        public List<ReviewModel> Reviews { get; set; }
        public List<double> Breakdown { get; set; }
    }
}
