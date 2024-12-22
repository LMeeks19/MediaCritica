import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { SnackbarProvider } from "notistack";
import ConfirmationDialog from "./Components/ConfirmationDialog";
import "./App.scss";


function App() {
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
