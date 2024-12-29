using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class ReviewMapper
    {
        public Review MapReview(ReviewModel reviewModel)
        {
            return new Review()
            {
                Date = reviewModel.Date,
                Description = reviewModel.Description,
                MediaId = reviewModel.MediaId,
                MediaPoster = reviewModel.MediaPoster,
                MediaTitle = reviewModel.MediaTitle,
                MediaType = reviewModel.MediaType,
                Rating = reviewModel.Rating,
                ReviewerId = reviewModel.ReviewerId,
                Title = reviewModel.Title,
            };
        }

        public ReviewModel MapReviewModel(Review review)
        {
            return new ReviewModel()
            {
                Id = review.Id,
                Date = review.Date,
                Description = review.Description,
                MediaType = review.MediaType,
                MediaId = review.MediaId,
                MediaPoster = review.MediaPoster,
                MediaTitle = review.MediaTitle,
                Rating = review.Rating,
                ReviewerId = review.ReviewerId,
                ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}",
                Title = review.Title,
            };
        }

        public ReviewSummaryModel MapReviewSummaryModel(Review review)
        {
            return new ReviewSummaryModel()
            {
                Id = review.Id,
                Date = review.Date,
                Rating = review.Rating,
                ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}",
                Title = review.Title,
            };
        }
    }
}
