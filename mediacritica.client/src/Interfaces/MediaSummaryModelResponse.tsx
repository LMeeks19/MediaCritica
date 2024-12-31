import { MediaSummaryModel } from "./MediaSummaryModel";

export interface MediaSummaryModelResponse {
    totalMediaCount: number;
    mediaSummaryModels: MediaSummaryModel[]
}