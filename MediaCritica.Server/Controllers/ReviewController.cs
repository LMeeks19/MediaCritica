using MediaCritica.Server.Enums;
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
        [Route("[action]/{mediaId}/{reviewerEmail}")]
        public async Task<ReviewModel?> GetReview(string mediaId, string reviewerEmail)
        {
            var review = await _databaseContext.Reviews.SingleOrDefaultAsync(review => review.MediaId == mediaId && review.ReviewerEmail == reviewerEmail);

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
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            };
        }

        [HttpGet(Name = "GetReviews")]
        [Route("[action]/{reviewerEmail}")]
        public ReviewsModel GetReviews(string reviewerEmail)
        {
            var reviews = new ReviewsModel { 
                MovieReviews =  GetMovieReviews(reviewerEmail, 0).Result,
                SeriesReviews = GetSeriesReviews(reviewerEmail, 0).Result,
                GameReviews = GetGameReviews(reviewerEmail, 0).Result,
                EpisodeReviews = GetEpisodeReviews(reviewerEmail, 0).Result,
            };

            return reviews;
        }

        [HttpGet(Name = "GetMovieReviews")]
        [Route("[action]/{reviewerEmail}/{offset}")]
        public async Task<List<ReviewModel>> GetMovieReviews(string reviewerEmail, int offset)
        {
            var reviews = await _databaseContext.Reviews.Where(review => review.ReviewerEmail == reviewerEmail && review.MediaType == MediaType.Movie).Select(review => new ReviewModel()
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
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            }).OrderByDescending(review => review.Date).Skip(offset).Take(10).ToListAsync();

            return reviews;
        }

        [HttpGet(Name = "GetSeriesReviews")]
        [Route("[action]/{reviewerEmail}/{offset}")]
        public async Task<List<ReviewModel>> GetSeriesReviews(string reviewerEmail, int offset)
        {
            var reviews = await _databaseContext.Reviews.Where(review => review.ReviewerEmail == reviewerEmail && review.MediaType == MediaType.Series).Select(review => new ReviewModel()
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
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            }).OrderByDescending(review => review.Date).Skip(offset).Take(10).ToListAsync();

            return reviews;
        }

        [HttpGet(Name = "GetGameReviews")]
        [Route("[action]/{reviewerEmail}/{offset}")]
        public async Task<List<ReviewModel>> GetGameReviews(string reviewerEmail, int offset)
        {
            var reviews = await _databaseContext.Reviews.Where(review => review.ReviewerEmail == reviewerEmail && review.MediaType == MediaType.Game).Select(review => new ReviewModel()
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
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            }).OrderByDescending(review => review.Date).Skip(offset).Take(10).ToListAsync();

            return reviews;
        }

        [HttpGet(Name = "GetEpisodeReviews")]
        [Route("[action]/{reviewerEmail}/{offset}")]
        public async Task<List<ReviewModel>> GetEpisodeReviews(string reviewerEmail, int offset)
        {
            var reviews = await _databaseContext.Reviews.Where(review => review.ReviewerEmail == reviewerEmail && review.MediaType == MediaType.Episode).Select(review => new ReviewModel()
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
                ReviewerEmail = review.ReviewerEmail,
                Rating = review.Rating,
                Description = review.Description,
                Date = review.Date
            }).OrderByDescending(review => review.Date).Skip(offset).Take(10).ToListAsync();

            return reviews;
        }

        [HttpPost(Name = "PostReview")]
        [Route("[action]")]
        public async Task PostReview([FromBody] ReviewModel reviewModel)
        {
            var review = new Review() {
                MediaId = reviewModel.MediaId,
                MediaPoster = reviewModel.MediaPoster,
                MediaTitle = reviewModel.MediaTitle,
                MediaType = reviewModel.MediaType,
                MediaSeason = reviewModel.MediaSeason,
                MediaEpisode = reviewModel.MediaEpisode,
                MediaParentId = reviewModel.MediaParentId,
                MediaParentTitle = reviewModel.MediaParentTitle,
                ReviewerEmail = reviewModel.ReviewerEmail,
                Rating = reviewModel.Rating,
                Description = reviewModel.Description,
                Date = reviewModel.Date
            };

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();
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

