using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public ReviewController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        [HttpGet(Name = "GetReview")]
        [Route("[action]/{reviewId}")]
        public async Task<ReviewModel?> GetReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .Include(review => review.Reviewer)
                .SingleOrDefaultAsync(review => review.Id == reviewId);

            if (review == null)
                return null;

            return new ReviewModel()
            {
                Id = review.Id,
                MediaId = review.MediaId,
                MediaPoster = review.MediaPoster,
                MediaTitle = review.MediaTitle,
                MediaType = review.MediaType,
                MediaSeason = review.MediaSeason,
                MediaEpisode = review.MediaEpisode,
                MediaParentId = review.MediaParentId,
                MediaParentTitle = review.MediaParentTitle,
                ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}".Trim(),
                ReviewerId = review.ReviewerId,
                Title = review.Title,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            };
        }

        [HttpGet(Name = "GetUserReviews")]
        [Route("[action]/{reviewerId}/{offset}")]
        public async Task<List<ReviewModel>> GetUserReviews(int reviewerId, int offset)
        {
            var reviews = await _databaseContext.Reviews
                .Where(review => review.ReviewerId == reviewerId)
                .Select(review => new ReviewModel()
                {
                    Id = review.Id,
                    MediaId = review.MediaId,
                    MediaPoster = review.MediaPoster,
                    MediaTitle = review.MediaTitle,
                    MediaType = review.MediaType,
                    MediaSeason = review.MediaSeason,
                    MediaEpisode = review.MediaEpisode,
                    MediaParentId = review.MediaParentId,
                    MediaParentTitle = review.MediaParentTitle,
                    ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}".Trim(),
                    ReviewerId = review.ReviewerId,
                    Title = review.Title,
                    Rating = review.Rating,
                    Description = review.Description,
                    Date = review.Date
                }).OrderByDescending(review => review.Date)
                .Skip(offset)
                .Take(20)
                .ToListAsync();

            return reviews;
        }

        [HttpGet(Name = "Get10MediaReviews")]
        [Route("[action]/{mediaId}")]
        public async Task<List<ReviewSummaryModel>> Get10MediaReviews(string mediaId)
        {
            var reviews = await _databaseContext.Reviews
                .Include(review => review.Reviewer)
                .Where(review => review.MediaId == mediaId)
                .Select(review => new ReviewSummaryModel()
                {
                    Id = review.Id,
                    ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}".Trim(),
                    Title = review.Title,
                    Rating = review.Rating,
                    Date = review.Date
                }).OrderByDescending(review => review.Date)
                .Take(10)
                .ToListAsync();

            return reviews;
        }

        [HttpGet(Name = "Ge40MediaReviews")]
        [Route("[action]/{mediaId}/{offset}")]
        public async Task<List<ReviewSummaryModel>> Get40MediaReviews(string mediaId, int offset)
        {
            var reviews = await _databaseContext.Reviews
                .Include(review => review.Reviewer)
                .Where(review => review.MediaId == mediaId)
                .Select(review => new ReviewSummaryModel()
                {
                    Id = review.Id,
                    ReviewerName = $"{review.Reviewer.Forename} {review.Reviewer.Surname}".Trim(),
                    Title = review.Title,
                    Rating = review.Rating,
                    Date = review.Date
                }).OrderByDescending(review => review.Date)
                .Skip(offset)
                .Take(40)
                .ToListAsync();

            return reviews;
        }

        [HttpPost(Name = "PostReview")]
        [Route("[action]")]
        public async Task<int> PostReview([FromBody] ReviewModel reviewModel)
        {
            var review = new Review()
            {
                MediaId = reviewModel.MediaId,
                MediaPoster = reviewModel.MediaPoster,
                MediaTitle = reviewModel.MediaTitle,
                MediaType = reviewModel.MediaType,
                MediaSeason = reviewModel.MediaSeason,
                MediaEpisode = reviewModel.MediaEpisode,
                MediaParentId = reviewModel.MediaParentId,
                MediaParentTitle = reviewModel.MediaParentTitle,
                ReviewerId = reviewModel.ReviewerId,
                Title = reviewModel.Title,
                Rating = reviewModel.Rating,
                Description = reviewModel.Description,
                Date = reviewModel.Date
            };

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();

            return review.Id;
        }

        [HttpPut(Name = "UpdateReview")]
        [Route("[action]")]
        public async Task<ReviewModel> UpdateReview([FromBody] UpdateReviewModel updateReviewModel)
        {
            var review = _databaseContext.Reviews.Single(review => review.Id == updateReviewModel.ReviewId);

            review.Title = updateReviewModel.Title;
            review.Description = updateReviewModel.Description;
            review.Rating = updateReviewModel.Rating;
            review.Date = updateReviewModel.Date;

            _databaseContext.Reviews.Update(review);
            await _databaseContext.SaveChangesAsync();

            return GetReview(review.Id).Result!;
        }

        [HttpDelete(Name = "DeleteReview")]
        [Route("[action]/{reviewId}")]
        public void DeleteReview(int reviewId)
        {
            var review = _databaseContext.Reviews.Single(review => review.Id == reviewId);

            _databaseContext.Reviews.Remove(review);
            _databaseContext.SaveChanges();
        }
    }
}

