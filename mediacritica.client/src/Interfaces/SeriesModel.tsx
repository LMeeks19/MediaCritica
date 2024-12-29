import { MediaModel } from "./MediaModel";
import { ReviewSummaryModel } from "./ReviewSummaryModel";
import { SeasonModel } from "./SeasonModel";

export interface SeriesModel extends MediaModel {
  totalSeasons: string;
  seasons: SeasonModel[];
  reviews: ReviewSummaryModel[]
}
