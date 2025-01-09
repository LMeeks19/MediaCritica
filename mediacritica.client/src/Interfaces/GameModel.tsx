import { MediaModel } from "./MediaModel";

export interface GameModel extends MediaModel {
  boxOffice: string;
  dvd: string;
  website: string;
  production: string;
}
