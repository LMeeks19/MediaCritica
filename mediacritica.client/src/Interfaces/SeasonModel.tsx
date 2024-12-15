import { EpisodeSummaryModel } from "./EpisodeSummaryModel";

export interface SeasonModel {
    Season: string;
    Title: string;
    Episodes: EpisodeSummaryModel[];
}