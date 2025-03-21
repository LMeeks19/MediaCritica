import { useEffect, useState } from "react";
import "./NotificationsPage.scss";
import { useRecoilState, useRecoilValue } from "recoil";
import { notificationsState, userState } from "../State/GlobalState";
import TopBar from "../Components/TopBar";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import { GetUserNotifications } from "../Server/Server";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Button,
  Fab,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import { NotificationModel } from "../Interfaces/NotificationModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";

function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const user = useRecoilValue(userState);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedSorter, setSelectedSorter] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id === undefined) navigate("/login");
    else {
      FetchNotifications();
    }
  }, [user]);

  async function FetchNotifications() {
    setIsLoading(true);
    if (notifications.length !== user.totalNotifications) {
      const notificationsData = await GetUserNotifications(
        user.id,
        notifications.length ?? 0
      );
      setNotifications(notificationsData);
    }
    setIsLoading(false);
  }

  async function MarkAllAsRead() {
    await fetch(`/Notification/MarkAllAsRead/${user.id}`, {
      method: "PUT",
    }).then(() => {
      setNotifications(
        notifications.map((n) => {
          return { ...n, isRead: true };
        })
      );
    });
  }

  async function MarkAsRead(notificationId: number) {
    await fetch(`/Notification/MarkAsRead/${notificationId}`, {
      method: "PUT",
    }).then(() => {
      setNotifications(
        notifications.map((n) => {
          if (n.id === notificationId) {
            return { ...n, isRead: true };
          }
          return n;
        })
      );
    });
  }

  async function UpdateBookmarkStatus(notificationId: number) {
    await fetch(`/Notification/UpdateBookmarkStatus/${notificationId}`, {
      method: "PUT",
    }).then(() => {
      setNotifications(
        notifications.map((n) => {
          if (n.id === notificationId) {
            return { ...n, isBookmarked: !n.isBookmarked };
          }
          return n;
        })
      );
    });
  }

  async function DeleteNotification(notificationId: number) {
    await fetch(`/Notification/Delete/${notificationId}`, {
      method: "DELETE",
    }).then(() => {
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    });
  }

  function Filtered(notifications: NotificationModel[]): NotificationModel[] {
    if (selectedFilter === "unread")
      return notifications.filter((n) => !n.isRead) ?? [];
    else if (selectedFilter === "bookmarked")
      return notifications.filter((n) => n.isBookmarked) ?? [];
    return notifications ?? [];
  }

  function Sorted(notifications: NotificationModel[]): NotificationModel[] {
    if (selectedSorter === 1)
      return (
        notifications
          .map((n) => n)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ) ?? []
      );
    else if (selectedSorter === 2)
      return (
        notifications
          .map((n) => n)
          .sort((a, b) => a.message.localeCompare(b.message)) ?? []
      );
    else if (selectedSorter === 3)
      return (
        notifications
          .map((n) => n)
          .sort((a, b) => b.message.localeCompare(a.message)) ?? []
      );
    return notifications ?? [];
  }

  return (
    <div className="notificationspage-container">
      <div className="notifications">
        <TopBar />
        <div className="header palette">
          <h1>Notifications</h1>
          <div className="actions">
            {notifications.some((n) => !n.isRead) && (
              <CustomTooltip
                title={
                  notifications.some((n) => !n.isRead) && "Mark all as read"
                }
                arrow
              >
                <Button
                  onClick={() => MarkAllAsRead()}
                  disabled={notifications.every((n) => n.isRead)}
                >
                  <DoneAllIcon />
                </Button>
              </CustomTooltip>
            )}
            <CustomTooltip title="Sort by" arrow>
              <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                <Select
                  value={selectedSorter}
                  onChange={(e) => setSelectedSorter(Number(e.target.value))}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltOutlinedIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={0}>Date (New-Old)</MenuItem>
                  <MenuItem value={1}>Date (Old-New)</MenuItem>
                  <MenuItem value={2}>Alphabetical (A-Z)</MenuItem>
                  <MenuItem value={3}>Alphabetical (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </CustomTooltip>

            <ToggleButtonGroup
              value={selectedFilter}
              onChange={(e, v) => {
                e.stopPropagation();
                setSelectedFilter(v);
              }}
              exclusive
            >
              <CustomTooltip title="Filter by unread" arrow>
                <ToggleButton value="unread">
                  <MarkEmailUnreadIcon />
                </ToggleButton>
              </CustomTooltip>
              <CustomTooltip title="Filter by bookmarked" arrow>
                <ToggleButton value="bookmarked">
                  <BookmarkIcon />
                </ToggleButton>
              </CustomTooltip>
            </ToggleButtonGroup>
          </div>
        </div>
        <div className="content">
          {isLoading ? (
            <Loader />
          ) : Filtered(notifications).length === 0 && !isLoading ? (
            <div className="items empty">No Notifications</div>
          ) : (
            <div className="items">
              {Sorted(Filtered(notifications)).map((notification) => {
                return (
                  <div
                    key={notification.id}
                    className={`notification ${
                      notification.isRead ? "read" : "unread"
                    }`}
                  >
                    {!notification.isRead && <div className="blob" />}
                    <div className="details">
                      <div className="message">{notification.message}</div>
                      <div className="date">
                        {`${CapitaliseFirstLetter(
                          formatDistanceToNowStrict(notification.createdAt)
                        )}
                        ago | ${notification.authorName}`}
                      </div>
                    </div>
                    <div className="actions">
                      {!notification.isRead && (
                        <CustomTooltip title="Mark as read" arrow>
                          <IconButton
                            disabled={notification.isRead}
                            onClick={() => MarkAsRead(notification.id)}
                          >
                            <MarkEmailUnreadIcon />
                          </IconButton>
                        </CustomTooltip>
                      )}

                      <CustomTooltip
                        title={
                          notification.isBookmarked ? "Unbookmark" : "Bookmark"
                        }
                        arrow
                      >
                        <IconButton
                          onClick={() => UpdateBookmarkStatus(notification.id)}
                        >
                          {notification.isBookmarked ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                      </CustomTooltip>

                      <CustomTooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => DeleteNotification(notification.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CustomTooltip>
                    </div>
                  </div>
                );
              })}
              <div
                className={`flex justify-center items-center p-3 ${
                  notifications.length === user.totalNotifications && "hidden"
                }`}
              >
                <CustomTooltip title="Load more" arrow>
                  <span>
                    <Fab
                      onClick={() => FetchNotifications()}
                      disabled={
                        notifications.length === user.totalNotifications
                      }
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
