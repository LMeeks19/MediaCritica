import { useEffect, useState } from "react";
import "./NotificationsPage.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { notificationsObjectState, userState } from "../State/GlobalState";
import TopBar from "../Components/TopBar";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import { GetUserNotifications } from "../Server/Server";
import { format } from "date-fns";
import { Button, Fab, IconButton } from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddIcon from "@mui/icons-material/Add";
import { CustomTooltip } from "../Components/Tooltip";

function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsObject, setNotificationsObject] = useRecoilState(
    notificationsObjectState
  );
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id === undefined) navigate("/login");
    else {
      FetchNotifications();
    }
  }, [user]);

  async function FetchNotifications() {
    setIsLoading(true);
    if (
      notificationsObject.notifications?.length !==
        notificationsObject.totalCount ||
      notificationsObject.totalCount === -1
    ) {
      const notificationsData = await GetUserNotifications(
        user.id,
        notificationsObject.notifications?.length ?? 0
      );
      setNotificationsObject(notificationsData);
    }
    setIsLoading(false);
  }

  async function MarkAllAsRead() {
    await fetch(`/Notification/MarkAllAsRead/${user.id}`, {
      method: "PUT",
    }).then(() => {
      setNotificationsObject({
        totalCount: notificationsObject.totalCount,
        notifications: notificationsObject.notifications?.map((n) => {
          return { ...n, isRead: true };
        }),
      });
    });
  }

  async function MarkAsRead(notificationId: number) {
    await fetch(`/Notification/MarkAsRead/${notificationId}`, {
      method: "PUT",
    }).then(() => {
      setNotificationsObject({
        totalCount: notificationsObject.totalCount,
        notifications: notificationsObject.notifications?.map((n) => {
          if (n.id === notificationId) {
            return { ...n, isRead: true };
          }
          return n;
        }),
      });
    });
  }

  async function UpdateBookmarkStatus(notificationId: number) {
    await fetch(`/Notification/UpdateBookmarkStatus/${notificationId}`, {
      method: "PUT",
    }).then(() => {
      setNotificationsObject({
        totalCount: notificationsObject.totalCount,
        notifications: notificationsObject.notifications?.map((n) => {
          if (n.id === notificationId) {
            return { ...n, isBookmarked: !n.isBookmarked };
          }
          return n;
        }),
      });
    });
  }

  async function DeleteNotification(notificationId: number) {
    await fetch(`/Notification/Delete/${notificationId}`, {
      method: "DELETE",
    }).then(() => {
      setNotificationsObject({
        totalCount: notificationsObject.totalCount - 1,
        notifications: notificationsObject.notifications?.filter(
          (n) => n.id !== notificationId
        ),
      });
    });
  }

  return (
    <div className="notificationspage-container">
      <div className="notifications">
        <TopBar whiteText />
        <div className="header palette">
          <h1>Notifications</h1>
          <div className="actions">
            <CustomTooltip
              title={
                notificationsObject.notifications?.some((n) => !n.isRead) &&
                "Mark All as Read"
              }
            >
              <span>
                <Button
                  onClick={() => MarkAllAsRead()}
                  disabled={notificationsObject.notifications?.every(
                    (n) => n.isRead
                  )}
                >
                  <DoneAllIcon />
                </Button>
              </span>
            </CustomTooltip>
          </div>
        </div>
        <div className="content">
          {isLoading ? (
            <Loader />
          ) : notificationsObject.notifications?.length === 0 && !isLoading ? (
            <div className="items empty">No Notifications</div>
          ) : (
            <div className="items">
              {notificationsObject.notifications?.map((notification) => {
                return (
                  <div
                    key={notification.id}
                    className={`notification ${
                      notification.isRead ? "read" : "unread"
                    }`}
                  >
                    <div className="details">
                      <div className="message">{notification.message}</div>
                      <div className="date">
                        {format(
                          notification.createdAt,
                          "do MMMM yyyy, hh:mm:ss aaa"
                        )}
                      </div>
                    </div>
                    <div className="actions">
                      {!notification.isRead && (
                        <CustomTooltip title="Mark as Read">
                          <span>
                            <IconButton
                              disabled={notification.isRead}
                              onClick={() => MarkAsRead(notification.id)}
                            >
                              <MarkEmailUnreadIcon />
                            </IconButton>
                          </span>
                        </CustomTooltip>
                      )}

                      <CustomTooltip
                        title={`${
                          notification.isBookmarked ? "UnBookmark" : "Bookmark"
                        } Notification`}
                      >
                        <span>
                          <IconButton
                            onClick={() =>
                              UpdateBookmarkStatus(notification.id)
                            }
                          >
                            {notification.isBookmarked ? (
                              <BookmarkIcon />
                            ) : (
                              <BookmarkBorderIcon />
                            )}
                          </IconButton>
                        </span>
                      </CustomTooltip>

                      <CustomTooltip title="Delete Notification">
                        <span>
                          <IconButton
                            onClick={() => DeleteNotification(notification.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </CustomTooltip>
                    </div>
                  </div>
                );
              })}
              <div
                className={`flex justify-center items-center p-3 ${
                  notificationsObject.notifications?.length ===
                    notificationsObject.totalCount && "hidden"
                }`}
              >
                <CustomTooltip title="All reviewed media loaded" arrow>
                  <span>
                    <Fab
                      className="load-btn"
                      disabled={
                        notificationsObject.notifications?.length ===
                        notificationsObject.totalCount
                      }
                      onClick={() => FetchNotifications()}
                    >
                      <AddIcon />
                    </Fab>
                  </span>
                </CustomTooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
