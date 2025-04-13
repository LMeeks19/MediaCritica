import HomePage from "../Pages/HomePage";
import { createBrowserRouter } from "react-router-dom";
import MediaPage from "../Pages/MediaPage";
import AccountPage from "../Pages/AccountPage";
import WriteReviewPage from "../Pages/WriteReviewPage";
import ViewReviewPage from "../Pages/ViewReviewPage";
import ReviewsPage from "../Pages/ReviewsPage";
import LoginPage from "../Pages/LoginPage";
import ExplorePage from "../Pages/ExplorePage";
import LeaderboardsPage from "../Pages/LeaderboardsPage";
import ViewUserPage from "../Pages/ViewUserPage";
import NotificationsPage from "../Pages/NotificationsPage";
import NotFoundPage from "../Pages/NotFoundPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/explore", element: <ExplorePage /> },
  { path: "/leaderboards", element: <LeaderboardsPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
  { path: "/:type/:mediaId", element: <MediaPage /> },
  { path: "/:type/:mediaId/reviews", element: <ReviewsPage /> },
  { path: "/:type/:mediaId/reviews/write", element: <WriteReviewPage /> },
  {
    path: "/:type/:mediaId/reviews/:reviewId",
    element: <ViewReviewPage />,
  },
  { path: "/account", element: <AccountPage /> },
  { path: "/view-user/:username", element: <ViewUserPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
