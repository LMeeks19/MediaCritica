import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { useEffect } from "react";
import { GetUser } from "./Server/Server";
import { useRecoilState } from "recoil";
import { UserModel } from "./Interfaces/UserModel";
import { userState } from "./State/GlobalState";
import { SnackbarProvider } from "notistack";
import "./App.scss";
import ConfirmationDialog from "./Components/ConfirmationDialog";

function App() {
  const [user, setUser] = useRecoilState<UserModel>(userState);

  useEffect(() => {
    async function FetchUser() {
      const userData = await GetUser(user.email);
      setUser(userData);
    }
    FetchUser();
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={3000}
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
