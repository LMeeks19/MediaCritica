import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import AccountPage from "../Pages/AccountPage";
import EpisodePage from "../Pages/EpisodePage";
import ReviewPage from "../Pages/ReviewPage";

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
    element: <EpisodePage />,
  },
  { path: "/review",
    element: <ReviewPage />
   },
  {
    path: "/account",
    element: <AccountPage />,
  },
]);
