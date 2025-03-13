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
    public class ReviewController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, NotificationController notificationController) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;
        private readonly NotificationController _notificationController = notificationController;

        [HttpGet("[action]/{reviewId}")]
        public async Task<IActionResult> GetReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .Include(r => r.Engagements)
                .Include(r => r.Media)
                    .ThenInclude(m => (m as Episode)!.Season)
                .SingleOrDefaultAsync(r => r.Id == reviewId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            return Ok(_mapper.ReviewMapper.MapReviewModel(review));
        }

        [HttpGet("[action]/{reviewerId}/{offset}")]
        public async Task<IActionResult> GetUserReviews(int reviewerId, int offset)
        {
            var reviews = await _databaseContext.Reviews
                   .Include(r => r.Engagements)
                   .Include(r => r.Media)
                   .Where(r => r.UserId == reviewerId)
                   .OrderByDescending(r => r.Date)
                   .Skip(offset)
                   .Take(20)
                   .Select(r => _mapper.ReviewMapper.MapReviewModel(r))
                   .ToListAsync();

            var breakdown = await GetUserReviewsBreakdown(reviewerId);
            return Ok(new UserReviewsModelObject { Reviews = reviews, Breakdown = breakdown });
        }

        private async Task<List<double>> GetUserReviewsBreakdown(int userId)
        {
            var reviews = await _databaseContext.Reviews.Where(r => r.UserId == userId).ToListAsync();

            var reviewBreakdown = Enumerable.Range(0, 11)
                .Select(i => (double)reviews.Count(r => r.Rating == i * 0.5))
                .ToList();

            return reviewBreakdown;
        }

        [HttpGet("[action]/{mediaId}/{offset}/{limit}")]
        public async Task<IActionResult> GetMediaReviews(string mediaId, int offset, int limit)
        {
            var reviews = await _databaseContext.Reviews
                .Where(r => r.MediaId == mediaId)
                .OrderByDescending(r => r.Date)
                .Skip(offset)
                .Take(limit)
                .Select(r => _mapper.ReviewMapper.MapReviewSummaryModel(r))
                .ToListAsync();

            return Ok(new { Reviews = reviews, totalCount = reviews.Count });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> PostReview([FromBody] ReviewModel reviewModel)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Media)
                .Include(u => u.Engagements)
                .Include(u => u.Milestones)
                .FirstOrDefaultAsync(u => u.Id == reviewModel.ReviewerId);

            if (user == null)
                return NotFound(new { Message = "User not found" });
            if (!_databaseContext.Media.Any(m => m.Id == reviewModel.MediaId))
                return NotFound(new { Message = "Media not found" });
            if (user.Reviews.Any(r => r.UserId == reviewModel.ReviewerId && r.MediaId == reviewModel.MediaId))
                return Conflict(new { Message = "User has already reviewed this media" });

            var review = _mapper.ReviewMapper.MapReview(reviewModel);

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();

            await _notificationController.NotifyFollowers(new NewNotificationModel
            {
                AuthorId = review.UserId,
                AuthorName = review.ReviewerName,
                Message = $"Review created for {review.MediaTitle}"
            });

            review.Media = _databaseContext.Media.Single(m => m.Id == review.MediaId);

            await _helper.MilestoneCalculatorHelper.UpdateUserReviewMilestones(user);

            return Ok(new { review.Id });
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateReview([FromBody] UpdateReviewModel updateReviewModel)
        {
            var review = await _databaseContext.Reviews.SingleOrDefaultAsync(r => r.Id == updateReviewModel.ReviewId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            review.Title = updateReviewModel.Title;
            review.Description = updateReviewModel.Description;
            review.Rating = updateReviewModel.Rating;
            review.Date = updateReviewModel.Date;

            _databaseContext.Reviews.Update(review);
            await _databaseContext.SaveChangesAsync();

            await _notificationController.NotifyFollowers(new NewNotificationModel
            {
                AuthorId = review.UserId,
                AuthorName = review.ReviewerName,
                Message = $"{review.MediaTitle} review updated"
            });

            return await GetReview(review.Id);
        }

        [HttpDelete("[action]/{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var review = await _databaseContext.Reviews.FindAsync(reviewId);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            _databaseContext.Reviews.Remove(review);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Review Deleted" });
        }

        [HttpGet("[action]/{mediaId}/{userId}")]
        public async Task<IActionResult> GetUserReviewStatus(string mediaId, int userId)
        {
            var isReviewed = await _databaseContext.Reviews.AnyAsync(b => b.MediaId == mediaId && b.UserId == userId);

            return Ok(new { Value = isReviewed });
        }
    }
}

