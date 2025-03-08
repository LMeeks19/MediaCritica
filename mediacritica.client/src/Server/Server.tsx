import Snackbar from "../Components/Snackbar";
import { BacklogCategoryType } from "../Enums/BacklogCategoryType";
import { MediaType } from "../Enums/MediaType";
import { AccountFieldValue } from "../Interfaces/AccountModels";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { BacklogObjectModel } from "../Interfaces/BacklogObjectModel";
import { BacklogSummaryModel } from "../Interfaces/BacklogSummaryModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { GameModel } from "../Interfaces/GameModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";
import { MediaTrendModel } from "../Interfaces/MediaTrendModel";
import { MovieModel } from "../Interfaces/MovieModel";
import { NotificationModel } from "../Interfaces/NotificationModel";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { ReviewSummaryModel } from "../Interfaces/ReviewSummaryModel";
import { SeasonModel } from "../Interfaces/SeasonModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { UserFollowModel } from "../Interfaces/UserFollowModel";
import { UserFollowSummaryModel } from "../Interfaces/UserFollowSummaryModel";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import { PreferenceModel, UserModel } from "../Interfaces/UserModel";
import { UserRankingModel } from "../Interfaces/UserRankingModel";
import { UserReviewsModelObject } from "../Interfaces/UserReviewsModelObject";
import { UserSummaryModel } from "../Interfaces/UserSummaryModel";

interface RequestMessage {
  message: string;
}

interface RequestValue {
  value: boolean;
}

interface RequestId {
  id: number;
}

function isRequestMessageInterface(obj: any): obj is RequestMessage {
  return (
    typeof obj === "object" &&
    "message" in obj &&
    typeof obj.message === "string"
  );
}

async function MakeRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const data = await fetch(url, options);
    const response = await data.json();

    if (isRequestMessageInterface(response)) {
      switch (data.status) {
        case 200:
          Snackbar.Success((response as RequestMessage).message);
          break;
        default:
          Snackbar.Error((response as RequestMessage).message);
      }
    } else return response as T;
  } catch (error) {
    Snackbar.Error(error as string);
  }
  return Array.isArray([] as T) ? [] as T : {} as T;
}

// User API Calls
export async function GetUser(email: string): Promise<UserModel> {
  const response = await MakeRequest<UserModel>(`/User/GetUser/${email}`);
  return response;
}

export async function PostUser(user: UserModel): Promise<UserModel> {
  const response = await MakeRequest<UserModel>(`/User/PostUser`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response;
}

export async function UpdateUser(
  accountFieldValue: AccountFieldValue
): Promise<UserModel> {
  const response = await MakeRequest<UserModel>(`/User/UpdateUser`, {
    method: "PUT",
    body: JSON.stringify(accountFieldValue),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response;
}

export async function DeleteUser(userId: number): Promise<RequestValue> {
  const response = await MakeRequest<RequestValue>(
    `/User/DeleteUser/${userId}`
  );
  return response;
}

export async function GetUserSummary(
  userId: number
): Promise<UserSummaryModel> {
  const response = await MakeRequest<UserSummaryModel>(
    `/User/GetUserSummary/${userId}`
  );
  return response;
}

export async function UpdateUserPreference(
  preference: PreferenceModel
): Promise<PreferenceModel> {
  const response = await MakeRequest<PreferenceModel>(
    `/User/UpdateUserPreference`,
    {
      method: "PUT",
      body: JSON.stringify(preference),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }
  );
  return response;
}

// Media API Calls
export async function GetSearchResults(
  searchTerm: string,
  page: number = 1
): Promise<MediaSearchResponse> {
  const response = await MakeRequest<MediaSearchResponse>(
    `/Media/GetMediaBySearch/${searchTerm}/${page}`
  );
  return response;
}

export async function GetExploreMediaBySearch(
  searchTerm: string
): Promise<MediaSummaryModel[]> {
  const response = await MakeRequest<MediaSummaryModel[]>(
    `/Media/GetExploreMediaBySearch/${searchTerm}`
  );
  return response;
}

export async function GetExploreMedia(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetExploreMedia/${offset}`
  );
  return response;
}

export async function GetBestOfPrevYear(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetBestOfPrevYear/${offset}`
  );
  return response;
}

export async function GetBestOfCurYear(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetBestOfCurYear/${offset}`
  );
  return response;
}

export async function GetUpcoming(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetUpcoming/${offset}`
  );
  return response;
}

export async function GetSeasonalPicks(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetSeasonalPicks/${offset}`
  );
  return response;
}

export async function GetLatest(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetLatest/${offset}`
  );
  return response;
}

export async function GetRecentlyReviewed(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetRecentlyReviewed/${offset}`
  );
  return response;
}

export async function GetMostReviewed(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetMostReviewed/${offset}`
  );
  return response;
}

export async function GetBestOfAllTime(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await MakeRequest<MediaSummaryModelResponse>(
    `/Media/GetBestOfAllTime/${offset}`
  );
  return response;
}

export async function GetMedia(
  mediId: string,
  type: MediaType
): Promise<MovieModel | SeriesModel | GameModel> {
  if (type === MediaType.Movie) return GetMovie(mediId);
  else if (type === MediaType.Series) return GetSeries(mediId);
  return GetGame(mediId);
}

export async function GetMovie(mediaId: string): Promise<MovieModel> {
  const response = await MakeRequest<MovieModel>(`/Media/GetMovie/${mediaId}`);
  return response;
}

export async function GetSeries(mediaId: string): Promise<SeriesModel> {
  const response = await MakeRequest<SeriesModel>(
    `/Media/GetSeries/${mediaId}`
  );
  return response;
}

export async function GetGame(mediaId: string): Promise<GameModel> {
  const response = await MakeRequest<GameModel>(`/Media/GetGame/${mediaId}`);
  return response;
}

export async function GetSeason(
  mediaId: string,
  season: number = 1
): Promise<SeasonModel> {
  const response = await MakeRequest<SeasonModel>(
    `/Media/GetSeason/${mediaId}/${season}`
  );
  return response;
}

export async function GetEpisode(episodeId: string): Promise<EpisodeModel> {
  const response = await MakeRequest<EpisodeModel>(
    `/Media/GetEpisode/${episodeId}`
  );
  return response;
}

export async function GetReview(reviewId: number): Promise<ReviewModel> {
  const response = await MakeRequest<ReviewModel>(
    `/Review/GetReview/${reviewId}`
  );
  return response;
}

// Review API Calls
export async function GetUserReviews(
  reviewerId: number,
  offset: number = 0
): Promise<UserReviewsModelObject> {
  const response = await MakeRequest<UserReviewsModelObject>(
    `/Review/GetUserReviews/${reviewerId ?? -1}/${offset}`
  );
  return response;
}

export async function GetUserReviewsBreakdown(
  userId: number
): Promise<number[]> {
  const response = await MakeRequest<number[]>(
    `/Review/GetUserReviewsBreakdown/${userId}`
  );
  return response;
}

export async function GetMediaReviews(
  mediaId: string,
  offset: number = 0
): Promise<{ reviews: ReviewSummaryModel[]; totalCount: number }> {
  const response = await MakeRequest<{
    reviews: ReviewSummaryModel[];
    totalCount: number;
  }>(`/Review/GetMediaReviews/${mediaId}/${offset}/${40}`);
  return response;
}

export async function PostReview(review: ReviewModel): Promise<RequestId> {
  const response = await MakeRequest<RequestId>(`/Review/PostReview`, {
    method: "POST",
    body: JSON.stringify(review),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response;
}

export async function UpdateReview(
  updateReviewModel: UpdateReviewModel
): Promise<ReviewModel> {
  const response = await MakeRequest<ReviewModel>(`/Review/UpdateReview`, {
    method: "PUT",
    body: JSON.stringify(updateReviewModel),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response;
}

export async function DeleteReview(reviewerId: number): Promise<void> {
  await MakeRequest<void>(`/Review/DeleteReview/${reviewerId}`, {
    method: "DELETE",
  });
}

export async function GetUserReviewStatus(
  mediaId: string,
  userId: number
): Promise<RequestValue> {
  if (userId === undefined) return { value: false } as RequestValue;
  const response = await MakeRequest<RequestValue>(
    `/Review/GetUserReviewStatus/${mediaId}/${userId}`
  );
  return response;
}

// Backlog API Calls
export async function GetBacklog(userId: number): Promise<BacklogObjectModel> {
  const response = await MakeRequest<BacklogObjectModel>(
    `/Backlog/GetBacklog/${userId ?? -1}`
  );
  return response;
}

export async function GetUserMediaBackloggedStatus(
  mediaId: string,
  userId: number
): Promise<RequestValue> {
  if (userId === undefined) return { value: false } as RequestValue;
  const response = await MakeRequest<RequestValue>(
    `/Backlog/GetUserBacklogStatus/${mediaId}/${userId}`
  );
  return response;
}

export async function GetBackloggedBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await MakeRequest<BacklogModel[]>(
    `/Backlog/GetBackloggedBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response;
}

export async function GetInProgressBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await MakeRequest<BacklogModel[]>(
    `/Backlog/GetInProgressBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response;
}

export async function GetFinishedBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await MakeRequest<BacklogModel[]>(
    `/Backlog/GetFinishedBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response;
}

export async function PostBacklog(
  backlog: BacklogModel
): Promise<BacklogSummaryModel> {
  const response = await MakeRequest<BacklogSummaryModel>(
    `/Backlog/PostBacklog`,
    {
      method: "POST",
      body: JSON.stringify(backlog),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }
  );

  return response;
}

export async function DeleteBacklog(
  mediaId: string,
  userId: number
): Promise<void> {
  await MakeRequest<void>(`/Backlog/DeleteBacklog/${mediaId}/${userId}`, {
    method: "DELETE",
  });
}

export async function UpdateBacklogState(
  backlogId: number,
  newState: BacklogCategoryType
): Promise<void> {
  await MakeRequest<void>(
    `/Backlog/UpdateBacklogState/${backlogId}/${newState}`,
    {
      method: "PUT",
    }
  );
}

// Leaderboards API Calls
export async function GetUserRankings(
  timeframe: string
): Promise<UserRankingModel[]> {
  const response = await MakeRequest<UserRankingModel[]>(
    `/Leaderboard/GetUserRankings/${timeframe}`
  );
  return response;
}

export async function GetMediaTrends(
  timeframe: string
): Promise<MediaTrendModel[]> {
  const response = await MakeRequest<MediaTrendModel[]>(
    `/Leaderboard/GetMediaTrends/${timeframe}`
  );
  return response;
}

// Milestones API Calls
export async function GetUserMilestones(
  userId: number
): Promise<UserMilestoneModelObject[]> {
  const response = await MakeRequest<UserMilestoneModelObject[]>(
    `/Milestone/GetUserMilestones/${userId}`
  );
  return response;
}

// Engagement API Calls
export async function GetCurrentUserReviewEngagement(
  reviewId: number,
  userId: number
): Promise<number> {
  const response = await MakeRequest<number>(
    `/Engagement/GetUserEngagement/${reviewId}/${userId ?? -1}`
  );
  return response;
}

export async function ToggleReviewEngagement(
  reviewId: number,
  userId: number,
  type: number | null
): Promise<number> {
  const response = await MakeRequest<number>(
    `/Engagement/ToggleEngagement/${reviewId}/${userId}/${type ?? -1}`
  );
  return response;
}

export async function GetUserFollow(
  followerId: number,
  followedId: number
): Promise<UserFollowModel> {
  const response = await MakeRequest<UserFollowModel>(
    `/Follow/GetUserFollowStatus/${followerId}/${followedId}`
  );
  return response;
}

export async function FollowUser(
  userFollowModel: UserFollowModel
): Promise<UserFollowModel> {
  const response = await MakeRequest<UserFollowModel>(`/Follow/FollowUser`, {
    method: "POST",
    body: JSON.stringify(userFollowModel),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response;
}

export async function UnfollowUser(userFollowId: number): Promise<void> {
  await MakeRequest<void>(`/Follow/UnfollowUser/${userFollowId}`, {
    method: "DELETE",
  });
}

export async function ToggleUserFollowNotificationStatus(
  userFollowId: number
): Promise<RequestValue> {
  const response = await MakeRequest<RequestValue>(
    `/Follow/ToggleNotificationStatus/${userFollowId}`,
    { method: "PUT" }
  );
  return response;
}

export async function GetUserFollowers(
  userId: number,
  offset: number = 0
): Promise<UserFollowSummaryModel[]> {
  const response = await MakeRequest<UserFollowSummaryModel[]>(
    `/Follow/GetUserFollowers/${userId}/${offset}`
  );
  return response;
}

export async function GetUserFollowing(
  userId: number,
  offset: number = 0
): Promise<UserFollowSummaryModel[]> {
  const response = await MakeRequest<UserFollowSummaryModel[]>(
    `/Follow/GetUserFollowing/${userId}/${offset}`
  );
  return response;
}

export async function GetUserNotifications(
  userId: number,
  offset: number,
  limit: number = 25
): Promise<NotificationModel[]> {
  const response = await MakeRequest<NotificationModel[]>(
    `/Notification/GetUserNotifications/${userId}/${offset}/${limit}`
  );
  return response;
}
