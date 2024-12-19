import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import AccountPage from "../Pages/AccountPage";
import EpisodePage from "../Pages/EpisodePage";
import WriteReviewPage from "../Pages/WriteReviewPage";
import ViewReviewPage from "../Pages/ViewReviewPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/media/:mediaId", element: <MediaPage /> },
  {
    path: "/media/:mediaId/seasons/:seasonId/episodes/:episodeId",
    element: <EpisodePage />,
  },
  { path: "/media/:mediaId/write-review", element: <WriteReviewPage /> },
  { path: "/view-review/:reviewId", element: <ViewReviewPage /> },
  { path: "/account", element: <AccountPage /> },
]);
