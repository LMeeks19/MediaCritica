using MediaCritica.Server.Helpers;
using MediaCritica.Server.Mappers;
using MediaCritica.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController(DatabaseContext databaseContext, IMapper mapper, MilestoneCalculatorHelper milestoneCalculatorHelper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly IMapper _mapper = mapper;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;

        [HttpGet(Name = "GetReview")]
        [Route("[action]/{reviewId}")]
        public async Task<ReviewModel?> GetReview(int reviewId)
        {
            var review = await _databaseContext.Reviews
                .Include(r => r.Engagements)
                .SingleOrDefaultAsync(review => review.Id == reviewId);

            if (review == null)
                return null;

            return _mapper.ReviewMapper.MapReviewModel(review);
        }

        [HttpGet(Name = "GetUserReviews")]
        [Route("[action]/{reviewerId}/{offset}")]
        public async Task<List<ReviewModel>> GetUserReviews(int reviewerId, int offset)
        {
            return await _databaseContext.Reviews
                .Include(r => r.Engagements)
                .Where(review => review.UserId == reviewerId)
                .OrderByDescending(review => review.Date)
                .Select(review => _mapper.ReviewMapper.MapReviewModel(review))
                .Skip(offset)
                .Take(20)
                .ToListAsync();
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

            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Backlogs)
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

            return GetReview(review.Id).Result!;
        }

        [HttpDelete(Name = "DeleteReview")]
        [Route("[action]/{reviewId}")]
        public async void DeleteReview(int reviewId)
        {
            var user = _databaseContext.Users
                .Include(user => user.Reviews)
                    .ThenInclude(review => review.Media)
                .Include(user => user.Backlogs)
                .Include(user => user.Milestones)
                .Where(user => user.Reviews.Any(r => r.Id == reviewId))
                .Single();

            var review = user.Reviews.Single(r => r.Id == reviewId);

            _databaseContext.Reviews.Remove(review);
            _databaseContext.SaveChanges();

            await _milestoneCalculatorHelper.UpdateUserReviewMilestones(user);

        }
    }
}

