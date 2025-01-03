import { MediaTrendAwardTypeEnum, MediaTrendTimeFrameEnum } from "../Enums/MediaTrendTypes";

export interface MediaTrend {
    awardType: MediaTrendAwardTypeEnum;
    timeframe: MediaTrendTimeFrameEnum;
    title: string;
    description: string;
}