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
    public class ReviewController(DatabaseContext databaseContext, IMappers mapper, IHelpers helper, IDateTimeProviderHelper dateTimeProviderHelper, NotificationController notificationController) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMappers _mapper = mapper;
        private readonly IHelpers _helper = helper;
        private readonly NotificationController _notificationController = notificationController;
        private readonly IDateTimeProviderHelper _dateTimeProviderHelper = dateTimeProviderHelper;

        [HttpGet("[action]/{reviewId}")]
        public async Task<IActionResult> GetReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .Include(r => r.User)
                .Include(r => r.Engagements)
                .Include(r => r.Media)
                    .ThenInclude(m => (m as Episode)!.Season)
                .Include(r => r.Comments)
                    .ThenInclude(c => c.Replies)
                .SingleOrDefaultAsync(r => r.Id == reviewId && !r.IsDeleted);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            return Ok(_mapper.ReviewMapper.MapReviewModel(review));
        }

        [HttpGet("[action]/{offset}")]
        public async Task<IActionResult> GetUserReviews(int offset)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var reviews = await _databaseContext.Reviews
                   .Include(r => r.User)
                   .Include(r => r.Engagements)
                   .Include(r => r.Media)
                   .Include(r => r.Comments)
                       .ThenInclude(c => c.Replies)
                   .Where(r => r.UserId == userId && !r.IsDeleted)
                   .OrderByDescending(r => r.Date)
                   .Skip(offset)
                   .Take(20)
                   .Select(r => _mapper.ReviewMapper.MapReviewModel(r))
                   .ToListAsync();

            var breakdown = await GetUserReviewsBreakdown(userId);
            return Ok(new UserReviewsModelObject { Reviews = reviews, Breakdown = breakdown });
        }

        private async Task<List<double>> GetUserReviewsBreakdown(int? userId)
        {
            if (userId == null)
                return [];

            var reviews = await _databaseContext.Reviews
                .Where(r => r.UserId == userId && !r.IsDeleted)
                .ToListAsync();

            var reviewBreakdown = Enumerable.Range(0, 11)
                .Select(i => (double)reviews.Count(r => r.Rating == i * 0.5))
                .ToList();

            return reviewBreakdown;
        }

        [HttpGet("[action]/{mediaId}/{offset}/{limit}")]
        public async Task<IActionResult> GetMediaReviews(string mediaId, int offset, int limit)
        {
            var media = await _databaseContext.Media
                .Include(m => m.Reviews)
                    .ThenInclude(r => r.User)
                .Where(m => m.Id == mediaId)
                .SingleAsync();

            var reviews = media.Reviews
                .Where(r => !r.IsDeleted)
                .OrderByDescending(r => r.Date)
                .Skip(offset)
                .Take(limit)
                .Select(r => _mapper.ReviewMapper.MapReviewSummaryModel(r))
                .ToList();

            return Ok(new { media.Title, Reviews = reviews, totalCount = reviews.Count });
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

            var review = _mapper.ReviewMapper.MapReview(reviewModel, _dateTimeProviderHelper);

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();

            await _notificationController.NotifyFollowers(new NewNotificationModel
            {
                AuthorId = review.UserId,
                Message = $"Review created for {review.MediaTitle} {review.User.Username}"
            });

            review.Media = _databaseContext.Media.Single(m => m.Id == review.MediaId);

            await _helper.MilestoneCalculatorHelper.UpdateUserReviewMilestones(user);

            return Ok(new { review.Id });
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateReview([FromBody] UpdateReviewModel updateReviewModel)
        {
            var review = await _databaseContext.Reviews
                .SingleOrDefaultAsync(r => r.Id == updateReviewModel.ReviewId && !r.IsDeleted);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            review.Title = updateReviewModel.Title;
            review.Description = updateReviewModel.Description;
            review.Rating = updateReviewModel.Rating;
            review.Date = updateReviewModel.Date;

            await _databaseContext.SaveChangesAsync();

            await _notificationController.NotifyFollowers(new NewNotificationModel
            {
                AuthorId = review.UserId,
                Message = $"{review.User.Username} updated their {review.MediaTitle} review"
            });

            return await GetReview(review.Id);
        }

        [HttpDelete("[action]/{reviewId}")]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .SingleOrDefaultAsync(r => r.Id == reviewId && !r.IsDeleted);

            if (review == null)
                return NotFound(new { Message = "Review not found" });

            _databaseContext.Reviews.Remove(review);
            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Review Deleted" });
        }

        [HttpGet("[action]/{mediaId}")]
        public async Task<IActionResult> GetUserReviewStatus(string mediaId)
        {
            var userId = _helper.AuthenticationHelper.GetUserId();
            var isReviewed = await _databaseContext.Reviews
                .AnyAsync(r => r.MediaId == mediaId && r.UserId == userId && !r.IsDeleted);

            return Ok(new { Value = isReviewed });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ReportReview([FromBody] ReportModel reportModel)
        {
            if (_databaseContext.Reports.Any(r => r.ReporterId == reportModel.ReporterId && r.ReviewId == reportModel.ReviewId))
                return Conflict(new { Message = "Review Already Reported" });

            var review = await _databaseContext.Reviews
                .Include(c => c.Reports)
                .FirstOrDefaultAsync(c => c.Id == reportModel.ReviewId);
            if (review == null)
                return NotFound(new { Message = "Review Not Found" });

            if (!_databaseContext.Users.Any(u => u.Id == reportModel.ReporterId))
                return NotFound(new { Message = "User Not Found" });

            var report = new Report
            {
                ReviewId = reportModel.ReviewId,
                ReporterId = reportModel.ReporterId,
                Reason = reportModel.Reason,
                Details = reportModel.Details,
                ReportedAt = _dateTimeProviderHelper.UtcNow,
            };

            await _databaseContext.Reports.AddAsync(report);

            if (review.Reports.Count >= 10)
                review.IsDeleted = true;

            await _databaseContext.SaveChangesAsync();

            return Ok(new { Message = "Review Reported" });
        }
    }
}

