import { AccountFieldValue } from "../Interfaces/AccountModels";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { BacklogSummaryModel } from "../Interfaces/BacklogSummaryModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { GameModel } from "../Interfaces/GameModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import { MovieModel } from "../Interfaces/MovieModel";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { SeasonModel } from "../Interfaces/SeasonModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { UserModel } from "../Interfaces/UserModel";

const mediaServiceApiKey = import.meta.env.VITE_SERVICE_API_KEY;

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

export async function GetSearchResults(
  searchTerm: string
): Promise<MediaSearchResponse> {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetMedia(
  mediaId: string
): Promise<MovieModel | SeriesModel | GameModel> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${mediaId}&plot=full&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetSeason(
  mediaId: string,
  season: number = 1
): Promise<SeasonModel> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${mediaId}&season=${season}&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetEpisode(episodeId: string): Promise<EpisodeModel> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${episodeId}&plot=full&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetReview(
  reviewId: string,
): Promise<ReviewModel> {
  const response = await fetch(`/Review/GetReview/${reviewId}`);
  return response.json();
}

export async function GetReviews(
  reviewerId: number,
  offset: number = 0
): Promise<ReviewModel[]> {
  const response = await fetch(
    `/Review/GetReviews/${reviewerId ?? -1}/${offset}`
  );
  return response.json();
}

export async function PostReview(review: ReviewModel): Promise<number> {
  const response = await fetch(`/Review/PostReview`, {
    method: "POST",
    body: JSON.stringify(review),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  });
  return response.json()
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

export async function GetBacklog(
  userId: number,
  offset: number = 0
): Promise<BacklogModel[]> {
  const response = await fetch(`/Backlog/GetBacklog/${userId ?? -1}/${offset}`);
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
