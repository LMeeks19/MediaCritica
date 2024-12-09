using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet(Name = "GetReviews")]
        [Route("[action]/{reviewerId}")]
        public async Task GetReviews(int reviewerId)
        {

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
            };

            await _databaseContext.Reviews.AddAsync(review);
            await _databaseContext.SaveChangesAsync();
        }
    }
}
