import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SnackbarProvider } from "notistack";
import ConfirmationDialog from "./Components/ConfirmationDialog";
import { useEffect } from "react";
import NotificationHub from "./Hubs/NotificationHub";
import { useRecoilValue, useRecoilState } from "recoil";
import { setThemePalette } from "./Helpers/ThemePaletteHelper";
import { notificationsObjectState, userState } from "./State/GlobalState";

function App() {
  const user = useRecoilValue(userState);
  const [notificationsObject, setNotificationsObject] = useRecoilState(
    notificationsObjectState
  );

  useEffect(() => {
    if (user.id !== undefined) {
      setThemePalette(user.preference);
    }
  }, [user]);

  useEffect(() => {
    if (user.id === undefined) return;

    const notificationHub = NotificationHub.getInstance(user.id);

    if (notificationHub.isDisconnected()) 
      notificationHub.startConnection();

    // Subscribe to notifications
    notificationHub.onReceiveNotification(
      user.id,
      setNotificationsObject,
      notificationsObject.notifications?.length < 25
        ? 25
        : notificationsObject.notifications?.length + 1
    );

    return () => {
      notificationHub.stopConnection();
    };
  }, [user]);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={3000}
      preventDuplicate
      style={{ color: "whitesmoke" }}
    >
      <div className="wrapper">
        <ConfirmationDialog />
        <RouterProvider router={router} />
      </div>
    </SnackbarProvider>
  );
}

export default App;
