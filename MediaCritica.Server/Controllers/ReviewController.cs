using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController(DatabaseContext databaseContext, IMapper mapper, MilestoneCalculatorHelper milestoneCalculatorHelper, NotificationController notificationController) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMapper _mapper = mapper;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;
        private readonly NotificationController _notificationController = notificationController;

        [HttpGet(Name = "GetReview")]
        [Route("[action]/{reviewId}")]
        public async Task<ReviewModel?> GetReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .Include(r => r.Engagements)
                .Include(r => r.Media)
                    .ThenInclude(m => (m as Episode)!.Season)
                .SingleOrDefaultAsync(review => review.Id == reviewId);

            if (review == null)
                return null;

            return _mapper.ReviewMapper.MapReviewModel(review);
        }

        [HttpGet(Name = "GetUserReviews")]
        [Route("[action]/{reviewerId}/{offset}")]
        public async Task<UserReviewsModelObject> GetUserReviews(int reviewerId, int offset)
        {
            var reviews = await _databaseContext.Reviews
                .Include(r => r.Engagements)
                .Include(r => r.Media)
                .Where(review => review.UserId == reviewerId)
                .OrderByDescending(review => review.Date)
                .Select(review => _mapper.ReviewMapper.MapReviewModel(review))
                .Skip(offset)
                .Take(20)
                .ToListAsync();

            return new UserReviewsModelObject()
            {
                Reviews = reviews,
                Breakdown = await GetUserReviewsBreakdown(reviewerId),
            };
        }

        [HttpGet(Name = "GetUserReviewsBreakdown")]
        [Route("[action]/{userId}")]
        public async Task<List<double>> GetUserReviewsBreakdown(int userId)
        {
            var reviews = await _databaseContext.Reviews.Where(r => r.UserId == userId).ToListAsync();

            var reviewBreakdown = new List<double>();
            for (double rating = 0; rating <= 5; rating += 0.5)
            {
                reviewBreakdown.Add(reviews.Count(r => r.Rating == rating));
            }

            return reviewBreakdown;
        }

        [HttpGet(Name = "GeMediaReviews")]
        [Route("[action]/{mediaId}/{offset}/{limit}")]
        public async Task<List<ReviewSummaryModel>> GetMediaReviews(string mediaId, int offset, int limit)
        {
            return await _databaseContext.Reviews
                .Where(review => review.MediaId == mediaId)
                .OrderByDescending(review => review.Date)
                .Select(review => _mapper.ReviewMapper.MapReviewSummaryModel(review))
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }

        [HttpPost(Name = "PostReview")]
        [Route("[action]")]
        public async Task<int> PostReview([FromBody] ReviewModel reviewModel)
        {
            var review = _mapper.ReviewMapper.MapReview(reviewModel);

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();

            await _notificationController.NotifyFollowers(new NewNotificationModel()
            {
                AuthorId = review.UserId,
                AuthorName = review.ReviewerName,
                Message = $"Review created for {review.MediaTitle}"
            });

            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Engagements)
                .Include(user => user.Milestones)
                .FirstAsync(user => user.Id == review.UserId);

            await _milestoneCalculatorHelper.UpdateUserReviewMilestones(user);

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

            await _notificationController.NotifyFollowers(new NewNotificationModel()
            {
                AuthorId = review.UserId,
                AuthorName = review.ReviewerName,
                Message = $"{review.MediaTitle} review updated"
            });

            return GetReview(review.Id).Result!;
        }

        [HttpDelete(Name = "DeleteReview")]
        [Route("[action]/{reviewId}")]
        public async void DeleteReview(int reviewId)
        {
            var user = _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Engagements)
                .Include(user => user.Engagements)
                .Include(user => user.Milestones)
                .Where(user => user.Reviews.Any(r => r.Id == reviewId))
                .Single();

            var review = user.Reviews.Single(r => r.Id == reviewId);

            await _milestoneCalculatorHelper.UpdateUserReviewMilestones(user);

            _databaseContext.Reviews.Remove(review);
            _databaseContext.SaveChanges();
        }

        [HttpPut(Name = "GetUserReviewStatus")]
        [Route("[action]/{mediaId}/{userId}")]
        public IActionResult GetUserReviewStatus(string mediaId, int userId)
        {
            var isReviewed = _databaseContext.Reviews.Any(b => b.MediaId == mediaId && b.UserId == userId);

            return Ok(isReviewed);

        }
    }
}

