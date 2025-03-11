namespace MediaCritica.Server.Controllers
{
    public interface IControllers
    {
        BacklogController BacklogController { get; }
        EngagementController EngagementController { get; }
        FollowController FollowController { get; }
        LeaderboardController LeaderboardController { get; }
        MediaController MediaController { get; }
        MilestoneController MilestoneController { get; }
        NotificationController NotificationController { get; }
        ReviewController ReviewController { get; }
        UserController UserController { get; }
    }
}
