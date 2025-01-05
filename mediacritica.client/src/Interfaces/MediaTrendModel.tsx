import { MediaTrendAwardTypeEnum, MediaTrendTimeFrameEnum } from "../Enums/MediaTrendTypes";

export interface MediaTrendModel {
    awardType: MediaTrendAwardTypeEnum;
    timeframe: MediaTrendTimeFrameEnum;
    title: string;
    description: string;
}