import { MediaModel } from "./MediaModel";

export interface GameModel extends MediaModel {
    BoxOffice: string;
    DVD: string;
    Website: string;
    Production: string;
}