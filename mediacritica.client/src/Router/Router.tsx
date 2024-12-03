import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import LoginPage from "../Pages/LoginPage";
import AccountPage from "../Pages/AccountPage";
import EpisodePage from "../Pages/EpisodePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/media/:id",
    element: <MediaPage />,
  },
  {
    path: "/media/:id/seasons/:seasonId/episodes/:episodeId",
    element: <EpisodePage />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/account",
    element: <AccountPage />,
  }
]);
