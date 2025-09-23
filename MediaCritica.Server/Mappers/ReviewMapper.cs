using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class ReviewMapper
    {
        public async Task<Review> MapReview(ReviewModel reviewModel, IDateTimeProviderHelper dateTimeProviderHelper, ImageValidator imageValidator)
        {
            return new Review()
            {
                Date = dateTimeProviderHelper.UtcNow,
                Description = reviewModel.Description,
                MediaId = reviewModel.MediaId,
                MediaPoster = await imageValidator.GetValidImageUrlAsync(reviewModel.MediaPoster),
                MediaTitle = reviewModel.MediaTitle,
                MediaSeriesTitle = reviewModel.MediaSeriesTitle,
                MediaType = reviewModel.MediaType,
                Rating = reviewModel.Rating,
                UserId = reviewModel.ReviewerId,
                Title = reviewModel.Title,
            };
        }

        public async Task<ReviewModel> MapReviewModel(Review review, IDateTimeProviderHelper dateTimeProviderHelper, ImageValidator imageValidator)
        {
            return new ReviewModel()
            {
                Id = review.Id,
                Date = dateTimeProviderHelper.GetDateTimeDistance(dateTimeProviderHelper.UtcNow, review.Date),
                Description = review.Description,
                MediaType = review.MediaType,
                MediaId = review.MediaId,
                MediaPoster = await imageValidator.GetValidImageUrlAsync(review.MediaPoster),
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
                TotalComments = review.Comments.Count(c => c.Status == ContentStatus.Active),
            };
        }

        public ReviewSummaryModel MapReviewSummaryModel(Review review, IDateTimeProviderHelper dateTimeProviderHelper)
        {
            return new ReviewSummaryModel()
            {
                Id = review.Id,
                Date = dateTimeProviderHelper.GetDateTimeDistance(dateTimeProviderHelper.UtcNow, review.Date),
                Rating = review.Rating,
                ReviewerUsername = review.User.Username,
                MediaType = review.MediaType,
                Title = review.Title,
            };
        }
    }
}
