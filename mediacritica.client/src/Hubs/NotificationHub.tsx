import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import Snackbar from "../Components/Snackbar";

class NotificationHub {
  private connection: HubConnection | null = null;
  private static instance: NotificationHub;

  private constructor(userId: number) {
    // Create the connection but don't start it until needed
    this.connection = new HubConnectionBuilder()
      .withUrl(`/NotificationHub?userId=${userId}`, {
        transport: HttpTransportType.WebSockets,
      }) // Adjust URL to your hub endpoint
      .withAutomaticReconnect()
      .build();
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(userId: number): NotificationHub {
    if (!NotificationHub.instance) {
      NotificationHub.instance = new NotificationHub(userId);
    }
    return NotificationHub.instance;
  }

  public getState(): string {
    return this.connection?.state ?? "Disconnected";
  }

  // Start the connection
  public startConnection(): void {
    if (this.connection) {
      this.connection
        .start()
        .then(() => {
          console.log("Connected to SignalR hub");
        })
        .catch((err) =>
          console.error("Error starting SignalR connection:", err)
        );
    }
  }

  // Listen for notifications from the hub
  public onReceiveNotification(): void {
    if (this.connection) {
      this.connection.on("ReceiveNotification", () => {
        Snackbar.Info("New notification received");
      });
    }
  }

  // Stop the connection
  public stopConnection(): void {
    if (this.connection) {
      this.connection
        .stop()
        .then(() => {
          console.log("Disconnected from SignalR hub");
        })
        .catch((err) => {
          console.error("Error stopping SignalR connection:", err);
        });
    }
  }
}

export default NotificationHub;
