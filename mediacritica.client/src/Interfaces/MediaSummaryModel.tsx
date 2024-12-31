export interface MediaSummaryModel {
  id: string;
  title: string;
  type: string;
  poster?: string;
  genre: string;
  released: Date;
  imdbRating: number;
}
