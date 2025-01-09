import { MediaModel } from "./MediaModel";

export interface MovieModel extends MediaModel {
    boxOffice: string;
    dvd: string;
    production: string;
    website: string; 
}