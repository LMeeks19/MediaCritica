import { MediaModel } from "./MediaModel";

export interface EpisodeModel extends MediaModel {
  Episode: string;
  Season: string;
  seriesID: string;
}
