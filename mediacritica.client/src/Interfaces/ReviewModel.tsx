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
  reviewerId: number;
  rating: number;
  description: string;
  date: Date;
}
