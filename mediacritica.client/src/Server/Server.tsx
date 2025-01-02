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
import { MovieModel } from "../Interfaces/MovieModel";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { ReviewSummaryModel } from "../Interfaces/ReviewSummaryModel";
import { SeasonModel } from "../Interfaces/SeasonModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { PreferenceModel, UserModel } from "../Interfaces/UserModel";

// User API Calls
export async function GetUser(email: string): Promise<UserModel> {
  const response = await fetch(`/User/GetUser/${email}`);
  return response.json();
}

export async function PostUser(user: UserModel): Promise<UserModel> {
  const response = await fetch(`/User/PostUser`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return await response.json();
}

export async function UpdateUser(
  accountFieldValue: AccountFieldValue
): Promise<UserModel> {
  const response = await fetch(`/User/UpdateUser`, {
    method: "PUT",
    body: JSON.stringify(accountFieldValue),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return await response.json();
}

export async function DeleteUser(userId: number): Promise<boolean> {
  const response = await fetch(`/User/DeleteUser/${userId}`);
  return response.json();
}

export async function UpdateUserPreference(
  preference: PreferenceModel
): Promise<PreferenceModel> {
  const response = await fetch(`/User/UpdateUserPreference`, {
    method: "PUT",
    body: JSON.stringify(preference),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response.json();
}

// Media API Calls
export async function GetSearchResults(
  searchTerm: string,
  page: number = 1
): Promise<MediaSearchResponse> {
  const response = await fetch(`/Media/GetMediaBySearch/${searchTerm}/${page}`);
  return response.json();
}

export async function GetExploreMediaBySearch(
  searchTerm: string
): Promise<MediaSummaryModel[]> {
  const response = await fetch(`/Media/GetExploreMediaBySearch/${searchTerm}`);
  return response.json();
}

export async function GetExploreMedia(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetExploreMedia/${offset}`);
  return response.json();
}

export async function GetBestOfPrevYear(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetBestOfPrevYear/${offset}`);
  return response.json();
}

export async function GetBestOfCurYear(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetBestOfCurYear/${offset}`);
  return response.json();
}

export async function GetUpcoming(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetUpcoming/${offset}`);
  return response.json();
}

export async function GetSeasonalPicks(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetSeasonalPicks/${offset}`);
  return response.json();
}

export async function GetLatest(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetLatest/${offset}`);
  return response.json();
}

export async function GetRecentlyReviewed(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetRecentlyReviewed/${offset}`);
  return response.json();
}

export async function GetMostReviewed(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetMostReviewed/${offset}`);
  return response.json();
}

export async function GetBestOfAllTime(
  offset: number = 0
): Promise<MediaSummaryModelResponse> {
  const response = await fetch(`/Media/GetBestOfAllTime/${offset}`);
  return response.json();
}

export async function GetMedia(
  mediId: string,
  type: MediaType
): Promise<MovieModel | SeriesModel | GameModel> {
  if (type === MediaType.Movie) return await GetMovie(mediId);
  else if (type === MediaType.Series) return await GetSeries(mediId);
  return await GetGame(mediId);
}

export async function GetMovie(mediaId: string): Promise<MovieModel> {
  const response = await fetch(`/Media/GetMovie/${mediaId}`);
  return response.json();
}

export async function GetSeries(mediaId: string): Promise<SeriesModel> {
  const response = await fetch(`/Media/GetSeries/${mediaId}`);
  return response.json();
}

export async function GetGame(mediaId: string): Promise<GameModel> {
  const response = await fetch(`/Media/GetGame/${mediaId}`);
  return response.json();
}

export async function GetSeason(
  mediaId: string,
  season: number = 1
): Promise<SeasonModel> {
  const response = await fetch(`/Media/GetSeason/${mediaId}/${season}`);
  return response.json();
}

export async function GetEpisode(episodeId: string): Promise<EpisodeModel> {
  const response = await fetch(`/Media/GetEpisode/${episodeId}`);
  return response.json();
}

export async function GetReview(reviewId: string): Promise<ReviewModel> {
  const response = await fetch(`/Review/GetReview/${reviewId}`);
  return response.json();
}

// Review API Calls
export async function GetUserReviews(
  reviewerId: number,
  offset: number = 0
): Promise<ReviewModel[]> {
  const response = await fetch(
    `/Review/GetUserReviews/${reviewerId ?? -1}/${offset}`
  );
  return response.json();
}

export async function GetMediaReviews(
  mediaId: string,
  offset: number = 0
): Promise<ReviewSummaryModel[]> {
  const response = await fetch(
    `/Review/GetMediaReviews/${mediaId}/${offset}/${40}`
  );
  return response.json();
}

export async function PostReview(review: ReviewModel): Promise<number> {
  const response = await fetch(`/Review/PostReview`, {
    method: "POST",
    body: JSON.stringify(review),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response.json();
}

export async function UpdateReview(
  updateReviewModel: UpdateReviewModel
): Promise<ReviewModel> {
  const response = await fetch(`/Review/UpdateReview`, {
    method: "PUT",
    body: JSON.stringify(updateReviewModel),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response.json();
}

export async function DeleteReview(reviewerId: number): Promise<void> {
  await fetch(`/Review/DeleteReview/${reviewerId}`, {
    method: "DELETE",
  });
}

// Backlog API Calls
export async function GetBacklog(userId: number): Promise<BacklogObjectModel> {
  const response = await fetch(`/Backlog/GetBacklog/${userId ?? -1}`);
  return response.json();
}

export async function GetBackloggedBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await fetch(
    `/Backlog/GetBackloggedBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response.json();
}

export async function GetInProgressBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await fetch(
    `/Backlog/GetInProgressBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response.json();
}

export async function GetFinishedBacklog(
  userId: number,
  offset: number,
  limit: number
): Promise<BacklogModel[]> {
  const response = await fetch(
    `/Backlog/GetFinishedBacklog/${userId ?? -1}/${offset}/${limit}`
  );
  return response.json();
}

export async function PostBacklog(
  backlog: BacklogModel
): Promise<BacklogSummaryModel> {
  const response = await fetch(`/Backlog/PostBacklog`, {
    method: "POST",
    body: JSON.stringify(backlog),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });

  return response.json();
}

export async function DeleteBacklog(
  mediaId: string,
  userId: number
): Promise<void> {
  await fetch(`/Backlog/DeleteBacklog/${mediaId}/${userId}`, {
    method: "DELETE",
  });
}

export async function UpdateBacklogState(
  backlogId: number,
  newState: BacklogCategoryType
): Promise<void> {
  await fetch(`/Backlog/UpdateBacklogState/${backlogId}/${newState}`, {
    method: "PUT",
  });
}
