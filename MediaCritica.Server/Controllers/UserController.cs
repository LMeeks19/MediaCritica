using MediaCritica.Server.Enums;
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
    public class UserController(DatabaseContext databaseContext, MilestoneCalculatorHelper milestoneCalculatorHelper, IMapper mapper) : ControllerBase
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        private readonly MilestoneCalculatorHelper _milestoneCalculatorHelper = milestoneCalculatorHelper;
        private readonly IMapper _mapper = mapper;

        [HttpGet(Name = "GetUser")]
        [Route("[action]/{email}")]
        public async Task<UserModel> GetUser(string email)
        {
            var user = await _databaseContext.Users
                .Include(user => user.Reviews)
                .Include(user => user.Backlogs)
                .Include(user => user.Preference)
                .Include(user => user.Engagements)
                .SingleOrDefaultAsync(user => user.Email == email);

            if (user == null)
            {
                return new UserModel
                {
                    Id = null,
                    Forename = null,
                    Surname = null,
                    Email = null,
                    Password = null,
                    Preference = { },
                    BacklogSummary = [],
                    TotalReviews = 0,
                    TotalBacklogs = 0
                };
            }

            return new UserModel
            {
                Id = user.Id,
                Forename = user.Forename,
                Surname = user.Surname,
                Email = user.Email,
                Password = user.Password,
                Preference = new PreferenceModel()
                {
                    Id = user.Preference.Id,
                    Theme = user.Preference.Theme,
                    Palette = user.Preference.Palette,
                },
                TotalReviews = user.Reviews.Count,
                TotalBacklogs = user.Backlogs.Count
            };
        }

        [HttpPost(Name = "PostUser")]
        [Route("[action]")]
        public async Task<UserModel> PostUser([FromBody] CreateUserModel userModel)
        {
            var user = new User
            {
                Forename = userModel.Forename,
                Surname = userModel.Surname,
                Email = userModel.Email,
                Password = userModel.Password,
                Joined = DateTime.Now,
                Preference = new Preference()
                {
                    Theme = "System",
                    Palette = "#971212"
                },
                Milestones = _milestoneCalculatorHelper.CreateMilestones()
            };

            await _databaseContext.Users.AddAsync(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }

        [HttpPut(Name = "UpdateUser")]
        [Route("[action]")]
        public async Task<UserModel> UpdateUser([FromBody] UpdateUserModel updateUserModel)
        {
            var user = _databaseContext.Users.Single(user => user.Id == updateUserModel.UserId);

            if (updateUserModel.Type == UpdateUserEnum.Forename)
                user.Forename = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Surname)
                user.Surname = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Email)
                user.Email = updateUserModel.Value;
            if (updateUserModel.Type == UpdateUserEnum.Password)
                user.Password = updateUserModel.Value;

            _databaseContext.Users.Update(user);
            await _databaseContext.SaveChangesAsync();

            return GetUser(user.Email).Result;
        }

        [HttpPut(Name = "UpdateUserPreference")]
        [Route("[action]")]
        public async Task<PreferenceModel> UpdateUserPreference([FromBody] PreferenceModel preferenceModel)
        {
            var preference = _databaseContext.Preferences.Single(p => p.Id == preferenceModel.Id);

            preference.Theme = preferenceModel.Theme;
            preference.Palette = preferenceModel.Palette;

            _databaseContext.Preferences.Update(preference);
            await _databaseContext.SaveChangesAsync();

            return new PreferenceModel()
            {
                Id = preference.Id,
                Theme = preference.Theme,
                Palette = preference.Palette
            };
        }

        [HttpDelete(Name = "DeleteUser")]
        [Route("[action]/{userId}")]
        public async Task<bool> DeleteUser(int userId)
        {
            var user = _databaseContext.Users
                .Include(user => user.Preference)
                .Include(user => user.Reviews)
                .Include(user => user.Backlogs)
                .Single(user => user.Id == userId);

            _databaseContext.Users.Remove(user);
            await _databaseContext.SaveChangesAsync();

            return true;
        }

        [HttpGet(Name = "GetViewUserSummary")]
        [Route("[action]/{userId}")]
        public async Task<ViewUserSummaryModel?> GetViewUserSummary(int userId)
        {
            var user = await _databaseContext.Users
                .Include(u => u.Backlogs)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Engagements)
                .Include(u => u.Reviews)
                    .ThenInclude(r => r.Media)
                .Include(u => u.Milestones)
                .Include(u => u.Engagements)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .SingleOrDefaultAsync(user => user.Id == userId);

            if (user == null)
                return null;

            var reviewBreakdown = new List<double>();
            for (double rating = 0; rating <= 5; rating += 0.5)
            {
                reviewBreakdown.Add(user.Reviews.Count(r => r.Rating == rating));
            }

            return new ViewUserSummaryModel()
            {
                Id = user.Id,
                Name = $"{user.Forename} {user.Surname}",
                Joined = user.Joined,
                Reviews = user.Reviews
                    .OrderByDescending(review => review.Date)
                        .ThenByDescending(review => review.Rating)
                    .Take(8)
                    .Select(_mapper.ReviewMapper.MapReviewModel)
                    .ToList(),
                Milestones = _milestoneCalculatorHelper
                    .GetUserMilestones(user)
                    .Where(milestone => milestone.EarnedLevel > MilestoneLevel.None && milestone.EarnedDate != null)
                    .OrderByDescending(milestone => milestone.EarnedDate)
                        .ThenByDescending(milestone => milestone.EarnedLevel)
                    .Take(5)
                    .ToList(),
                ReviewsWritten = user.Reviews.Count,
                MediaBacklogged = user.Backlogs.Count,
                Followers = user.Followers.Count,
                Following = user.Following.Count,
                EngagementsReceivedLikes = user.Reviews.Sum(r => r.Engagements.Count(e => e.Type == EngagementType.Like)),
                EngagementsReceivedDislikes = user.Reviews.Sum(r => r.Engagements.Count(e => e.Type == EngagementType.Dislike)),
                EngagementsGivenLikes = user.Engagements.Count(e => e.Type == EngagementType.Like),
                EngagementsGivenDislikes = user.Engagements.Count(e => e.Type == EngagementType.Dislike),
                MilestonesEarned = user.Milestones.Count,
                Breakdown = reviewBreakdown,
            };
        }
    }
}