import { useEffect, useState } from "react";
import "./NotificationsPage.scss";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useRecoilValue(userState);

  useEffect(() => {
    // Fetch all notifications
    fetch(`/Notification/GetNotifications/${user.id ?? -1}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  const markAllAsRead = async () => {
    await fetch(`/Notification/MarkAllAsRead/${user.id}`, {
      method: "POST",
    }).then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <button onClick={markAllAsRead}>Mark All as Read</button>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={notification.isRead ? "read" : "unread"}
          >
            <div className="message">{notification.message}</div>
            <div className="timestamp">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;
