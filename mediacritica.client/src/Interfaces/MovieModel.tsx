import { MediaModel } from "./MediaModel";

export interface MovieModel extends MediaModel {
    BoxOffice: string;
    DVD: string;
    Production: string;
    Website: string; 
}