import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import AccountPage from "../Pages/AccountPage";
import EpisodePage from "../Pages/EpisodePage";
import WriteReviewPage from "../Pages/WriteReviewPage";
import ViewReviewPage from "../Pages/ViewReviewPage";
import ReviewsPage from "../Pages/ReviewsPage";
import LoginPage from "../Pages/LoginPage";
import ExplorePage from "../Pages/ExplorePage";
import LeaderboardsPage from "../Pages/LeaderboardsPage";
import ViewUserPage from "../Pages/ViewUserPage";
import NotificationsPage from "../Pages/NotificationsPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/explore", element: <ExplorePage /> },
  { path: "/leaderboards", element: <LeaderboardsPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/media/:mediaId", element: <MediaPage /> },
  {
    path: "/media/:mediaId/seasons/:seasonId/episodes/:episodeId",
    element: <EpisodePage />,
  },
  { path: "/media/:mediaId/reviews", element: <ReviewsPage /> },
  { path: "/media/:mediaId/write-review", element: <WriteReviewPage /> },
  {
    path: "/media/:mediaId/view-review/:reviewId",
    element: <ViewReviewPage />,
  },
  { path: "/account", element: <AccountPage /> },
  { path: "/view-user/:name", element: <ViewUserPage /> },
]);
