import { MediaType } from "../Enums/MediaType";

export interface ReviewModel {
  MediaId: string;
  MediaPoster: string;
  MediaTitle: string;
  MediaType: MediaType;
  MediaSeason: number;
  MediaEpisode: number;
  MediaParentId: string;
  MediaParentTitle: string;
  ReviewerId: number;
  Rating: number;
  Description: string;
}
