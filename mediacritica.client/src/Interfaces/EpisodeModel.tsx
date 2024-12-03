export interface EpisodeModel {
  Actors: string;
  Awards: string;
  Country: string;
  Director: string;
  Episode: string;
  Genre: string;
  Language: string;
  Metascore: string;
  Plot: string;
  Poster: string;
  Rated: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Released: string;
  Runtime: string;
  Season: string;
  Title: string;
  Type: string;
  Writer: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
  seriesID: string;
}
