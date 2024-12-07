import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeasonModel } from "../Interfaces/SeasonModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
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

export async function GetSearchResults(
  searchTerm: string
): Promise<MediaSearchResponse> {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetMedia(mediaId: string): Promise<MovieModel | SeriesModel> {
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

export async function GetEpisode(
  episodeId: string
): Promise<EpisodeModel> {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${episodeId}&plot=full&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}
