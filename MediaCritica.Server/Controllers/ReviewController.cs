using MediaCritica.Server.Models;
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
        public async void GetReviews(int reviewerId)
        {

        }

        [HttpPost(Name = "PostReview")]
        [Route("[action]")]
        public async void PostReview([FromBody] ReviewModel reviewModel)
        {
        }
    }
}
