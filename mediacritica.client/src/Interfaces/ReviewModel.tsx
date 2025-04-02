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
  reviewerName: string;
  reviewerId: number;
  title: string;
  rating: number;
  description: string;
  date: Date;
  likes: number;
  dislikes: number;
  totalComments: number;
}
