import { MediaType } from "../Enums/MediaType";

export interface ReviewModel {
  id: number;
  mediaId: string;
  mediaPoster: string;
  mediaTitle: string;
  mediaSeriesId: string;
  mediaSeriesTitle: string;
  mediaEpisode: string;
  mediaType: MediaType;
  reviewerUsername: string;
  reviewerId: number;
  title: string;
  rating: number;
  description: string;
  date: string;
  likes: number;
  dislikes: number;
  totalComments: number;
}
