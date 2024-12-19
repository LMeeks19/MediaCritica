import { MediaType } from "../Enums/MediaType";

export interface ReviewModel {
  id: number;
  mediaId: string;
  mediaPoster: string;
  mediaTitle: string;
  mediaType: MediaType;
  mediaSeason?: number;
  mediaEpisode?: number;
  mediaParentId?: string;
  mediaParentTitle?: string;
  reviewerName: string;
  reviewerId: number;
  title: string;
  rating: number;
  description: string;
  date: Date;
}
