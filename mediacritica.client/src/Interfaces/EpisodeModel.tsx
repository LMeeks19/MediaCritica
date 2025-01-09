import { MediaModel } from "./MediaModel";

export interface EpisodeModel extends MediaModel {
  episode: string;
  season: string;
  seasonId: string;
  seriesTitle: string;
}
