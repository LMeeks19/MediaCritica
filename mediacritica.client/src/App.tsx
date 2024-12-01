import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import "./App.css";

function App() {
  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
