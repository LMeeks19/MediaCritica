import { MediaType } from "../Enums/MediaType";

export interface ReviewModel {
  id: number;
  mediaId: string;
  mediaPoster: string;
  mediaTitle: string;
  mediaType: MediaType;
  reviewerName: string;
  reviewerId: number;
  title: string;
  rating: number;
  description: string;
  date: Date;
  likes: number;
  dislikes: number;
}
