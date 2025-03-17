import "./App.scss";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import NotificationHub from "./Hubs/NotificationHub";
import { useRecoilState } from "recoil";
import { setThemePalette } from "./Helpers/ThemePaletteHelper";
import { notificationsState, userState } from "./State/GlobalState";
import { getAuthToken, storeAuthToken } from "./Helpers/AuthenticationHelper";
import { AutoLogin } from "./Server/Server";
import Loader from "./Components/Loader";

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [notifications, setNotifications] = useRecoilState(notificationsState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function AutoLoginUser() {
      setIsLoading(true);
      var token = getAuthToken();

      if (token !== null) {
        var userObject = await AutoLogin(token);
        if (userObject.user !== null) {
          storeAuthToken(userObject.authToken);
          setUser(userObject.user);
          setThemePalette(userObject.user.preference);
        }
      }
      setIsLoading(false);
    }
    AutoLoginUser();
  }, []);

  useEffect(() => {
    if (user.id === undefined) return;

    const notificationHub = NotificationHub.getInstance(user.id);

    if (notificationHub.isDisconnected()) notificationHub.startConnection();

    // Subscribe to notifications
    notificationHub.onReceiveNotification(
      user.id,
      setNotifications,
      notifications?.length < 25 ? 25 : notifications?.length + 1,
      setUser
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
        {isLoading ? <Loader /> : <RouterProvider router={router} />}
      </div>
    </SnackbarProvider>
  );
}

export default App;
