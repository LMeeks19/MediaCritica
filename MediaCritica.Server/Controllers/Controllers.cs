namespace MediaCritica.Server.Controllers
{
    public class Controllers(BacklogController backlogController, EngagementController engagementController, FollowController followController, LeaderboardController leaderboardController, MediaController mediaController, MilestoneController milestoneController, NotificationController notificationController, ReviewController reviewController, UserController userController) : IControllers
    {
        public BacklogController BacklogController { get; set; } = backlogController;
        public EngagementController EngagementController { get; set; } = engagementController;
        public FollowController FollowController { get; set; } = followController;
        public LeaderboardController LeaderboardController { get; set; } = leaderboardController;
        public MediaController MediaController { get; set; } = mediaController;
        public MilestoneController MilestoneController { get; set; } = milestoneController;
        public NotificationController NotificationController { get; set; } = notificationController;
        public ReviewController ReviewController { get; set; } = reviewController;
        public UserController UserController { get; set; } = userController;
    }
}
