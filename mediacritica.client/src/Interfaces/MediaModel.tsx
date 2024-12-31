export interface MediaModel {
  id: string
  actors: string;
  awards: string;
  country: string;
  director: string;
  genre: string;
  language: string;
  metascore: string;
  plot: string;
  poster: string;
  rated: string;
  ratings: Rating[];
  released: string;
  runtime: string;
  title: string;
  type: string;
  writer: string;
  year: string;
  imdbRating: string;
  imdbVotes: string;
}

interface Rating {
  source: string;
  value: string;
}
