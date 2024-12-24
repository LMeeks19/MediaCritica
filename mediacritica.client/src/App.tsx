import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SnackbarProvider } from "notistack";
import ConfirmationDialog from "./Components/ConfirmationDialog";
import { useEffect } from "react";
import { userState } from "./State/GlobalState";
import { useRecoilValue } from "recoil";
import "./App.scss";
import { setThemePalette } from "./Helpers/ThemePaletteHelper";

function App() {
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user.id !== undefined) {
      setThemePalette(user.preference);
    }
  }, [user]);

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
