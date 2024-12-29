import { MediaModel } from "./MediaModel";
import { ReviewSummaryModel } from "./ReviewSummaryModel";

export interface GameModel extends MediaModel {
    boxOffice: string;
    dvd: string;
    website: string;
    production: string;
    reviews: ReviewSummaryModel[]
}