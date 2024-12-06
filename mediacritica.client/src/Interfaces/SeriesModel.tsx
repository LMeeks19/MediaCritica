import { MediaModel } from "./MediaModel";
import { SeasonModel } from "./SeasonModel";

export interface SeriesModel extends MediaModel {
  totalSeasons: string;
  seasons: SeasonModel[];
}
