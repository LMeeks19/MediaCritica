import { MediaModel } from "./MediaModel";
import { ReviewSummaryModel } from "./ReviewSummaryModel";

export interface MovieModel extends MediaModel {
    boxOffice: string;
    dvd: string;
    production: string;
    website: string; 
    reviews: ReviewSummaryModel[]
}