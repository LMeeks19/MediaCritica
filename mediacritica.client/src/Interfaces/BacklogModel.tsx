import { BacklogCategoryType } from "../Enums/BacklogCategoryType";
import { MediaType } from "../Enums/MediaType";

export interface BacklogModel {
  id: number;
  userId: string;
  mediaId: string;
  mediaType: MediaType;
  mediaPoster: string;
  mediaTitle: string;
  categoty: BacklogCategoryType;
  addedDate: Date;
}
