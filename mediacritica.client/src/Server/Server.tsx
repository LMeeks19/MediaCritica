import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { MediaModel } from "../Interfaces/MediaModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import { SeasonModel } from "../Interfaces/SeasonModel";
import { UserModel } from "../Interfaces/UserModel";

const mediaServiceApiKey = import.meta.env.VITE_SERVICE_API_KEY;

export async function GetUser(email: string): Promise<UserModel> {
  const response = await fetch(`/User/GetUser/${email}`);
  return response.json();
}

export async function GetSearchResults(
  searchTerm: string
): Promise<MediaSearchResponse> {
  const response = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=${mediaServiceApiKey}`
  );
  return response.json();
}

export async function GetMedia(mediaId: string): Promise<MediaModel> {
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
