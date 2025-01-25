using Microsoft.AspNetCore.SignalR;

namespace MediaCritica.Server.Hubs
{
    public class NotificationHub : Hub
    {
        // Static dictionary to store userId to a list of connectionIds (shared across all instances)
        private static readonly Dictionary<string, string> _userConnections = new Dictionary<string, string>();

        // Called when a user connects to the hub
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                _userConnections[userId!] = Context.ConnectionId;  // Store the userId and ConnectionId pair
            }

            await base.OnConnectedAsync();
        }

        // Called when a user disconnects from the hub
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = _userConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;

            if (!string.IsNullOrEmpty(userId))
            {
                _userConnections.Remove(userId!);  // Remove the userId and ConnectionId pair on disconnect
            }

            await base.OnDisconnectedAsync(exception);
        }

        public string GetUserConnecion(int userId)
        {
            return _userConnections.SingleOrDefault(u => u.Key == userId.ToString()).Value;
        }
    }
}
