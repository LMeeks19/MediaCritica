using MediaCritica.Server.Enums;
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
                MediaSeriesTitle = reviewModel.MediaSeriesTitle,
                MediaType = reviewModel.MediaType,
                Rating = reviewModel.Rating,
                UserId = reviewModel.ReviewerId,
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
                MediaSeriesId = review.Media.Type == MediaType.Episode ? (review.Media as Episode)!.Season?.SeriesId : null,
                MediaSeriesTitle = review.MediaSeriesTitle,
                MediaEpisode = review.Media.Type == MediaType.Episode ? $"S{(review.Media as Episode)!.EpisodeNo}:E{(review.Media as Episode)!.SeasonNo}" : null,
                Rating = review.Rating,
                ReviewerId = review.UserId,
                ReviewerUsername = review.User.Username,
                Title = review.Title,
                Likes = review.Engagements.Count(a => a.Type == EngagementType.Like),
                Dislikes = review.Engagements.Count(a => a.Type == EngagementType.Dislike),
                TotalComments = review.Comments.Count(c => !c.IsDeleted),
            };
        }

        public ReviewSummaryModel MapReviewSummaryModel(Review review)
        {
            return new ReviewSummaryModel()
            {
                Id = review.Id,
                Date = review.Date,
                Rating = review.Rating,
                ReviewerUsername = review.User.Username,
                MediaType = review.MediaType,
                Title = review.Title,
            };
        }
    }
}
