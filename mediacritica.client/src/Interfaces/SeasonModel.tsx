import { EpisodeSummaryModel } from "./EpisodeSummaryModel";

export interface SeasonModel {
    season: string;
    title: string;
    episodes: EpisodeSummaryModel[];
}