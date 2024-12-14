import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import AccountPage from "../Pages/AccountPage";
import EpisodePage from "../Pages/EpisodePage";
import WriteReviewPage from "../Pages/WriteReviewPage";
import ViewReviewPage from "../Pages/ViewReviewPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/media/:id", element: <MediaPage /> },
  {
    path: "/media/:id/seasons/:seasonId/episodes/:episodeId",
    element: <EpisodePage />,
  },
  { path: "/write-review", element: <WriteReviewPage /> },
  { path: "/view-review/:mediaId", element: <ViewReviewPage /> },
  { path: "/account", element: <AccountPage /> },
]);
