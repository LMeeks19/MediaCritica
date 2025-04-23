using MediaCritica.Server.Enums;
using MediaCritica.Server.Helpers;
using MediaCritica.Server.Models;
using MediaCritica.Server.Objects;

namespace MediaCritica.Server.Mappers
{
    public class MilestoneMapper
    {
        public Milestone MapMilestone(MilestoneType type)
        {
            return new Milestone()
            {
                MilestoneType = type,
                EarnedLevel = MilestoneLevel.None,
                EarnedDate = null
            };
        }

        public MilestoneModel MapMilestoneModel(string title, string description, MilestoneType type, string category, MilestoneLevel earnedLevel, DateTime? earnedDate, double current, double target, double percentage, IDateTimeProviderHelper dateTimeProviderHelper, string timezone)
        {
            return new MilestoneModel
            {
                Title = title,
                Description = description,
                Type = type,
                Category = category,
                EarnedLevel = earnedLevel,
                EarnedDate = earnedDate != null ? dateTimeProviderHelper.GetLocalDateTime((DateTime)earnedDate, timezone) : null,
                Progress = new ProgressModel()
                {
                    Current = current,
                    Target = target,
                    Percentage = percentage,
                },
            };
        }
    }
}
