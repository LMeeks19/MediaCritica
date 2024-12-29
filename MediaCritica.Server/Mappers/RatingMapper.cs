using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class RatingMapper
    {
        public Rating MapRating(RatingModel ratingModel)
        {
            return new Rating()
            {
                Source = ratingModel.Source,
                Value = ratingModel.Value,
            };
        }

        public RatingModel MapRatingModel(Rating rating)
        {
            return new RatingModel()
            {
                Source = rating.Source,
                Value = rating.Value,
            };
        }
    }
}
