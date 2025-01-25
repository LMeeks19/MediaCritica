using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace MediaCritica.Server.Hubs
{
    public class NotificationHub(DatabaseContext databaseContext) : Hub
    {
        private readonly DatabaseContext _databaseContext = databaseContext;
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _databaseContext.Users
                    .Include(u => u.Following)
                    .SingleOrDefaultAsync(u => u.Id == int.Parse(userId!));

                if (user != null)
                {
                    var following = user.Following.Select(f => f.FollowedId).ToList();

                    foreach (var followedId in following)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{followedId}_Group");
                    }
                }
            }



            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
