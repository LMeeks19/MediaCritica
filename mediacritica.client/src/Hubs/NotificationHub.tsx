import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import Snackbar from "../Components/Snackbar";
import { SetterOrUpdater } from "recoil";
import { NotificationModel } from "../Interfaces/NotificationModel";
import { GetUserNotifications } from "../Server/Server";
import { UserModel } from "../Interfaces/UserModel";

class NotificationHub {
  private connection: HubConnection | null = null;
  private static instance: NotificationHub;

  private constructor(userId: number) {
    // Create the connection
    this.connection = new HubConnectionBuilder()
      .withUrl(`/NotificationHub?userId=${userId}`, {
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();
  }

  // Singleton pattern to ensure only one instance
  public static getInstance(userId: number): NotificationHub {
    if (!NotificationHub.instance) {
      NotificationHub.instance = new NotificationHub(userId);
    }
    return NotificationHub.instance;
  }

  public isDisconnected() {
    return this.connection?.state === HubConnectionState.Disconnected;
  }

  // Start the connection
  public startConnection(): void {
    if (this.connection) {
      this.connection
        .start()
        .then(() => {
          console.log("Connected to NotificationHub");
        })
        .catch((err) =>
          console.error("Error starting NotificationHub connection:", err)
        );
    }
  }

  // Listen for notifications from the hub
  public onReceiveNotification(
    setNotifications: SetterOrUpdater<NotificationModel[]>,
    limit: number,
    setUser: SetterOrUpdater<UserModel>
  ): void {
    if (this.connection) {
      this.connection.on(
        "ReceiveNotification",
        async (message: string) => {
          if (location.pathname.endsWith("/notifications")) {
            const notificationsData = await GetUserNotifications(0, limit);
            setNotifications(notificationsData);
          } else {
            setNotifications([]);
            setUser((prev: UserModel) => ({
              ...prev,
              totalNotifications: prev.totalNotifications + 1,
            }));
            Snackbar.Info(
              `Notification Received: ${message}`
            );
          }
        }
      );
    }
  }

  // Stop the connection
  public stopConnection(): void {
    if (this.connection) {
      this.connection
        .stop()
        .then(() => {
          console.log("Disconnected from NotificationHub");
        })
        .catch((err) => {
          console.error("Error stopping NotificationHub connection:", err);
        });
    }
  }
}

export default NotificationHub;
