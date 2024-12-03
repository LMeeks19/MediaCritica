import { SeasonModel } from "./SeasonModel";

export interface MediaModel {
    Actors: string;
    Awards: string;
    Country: string;
    Director: string;
    Genre: string;
    Language: string;
    Metascore: string;
    Plot: string;
    Poster: string;
    Rated: string;
    Ratings: Array<{ Source: string; Value: string }>;
    Released: string;
    Runtime: string;
    Title: string;
    Type: string;
    Writer: string;
    Year: string;
    imdbID: string;
    imdbRating: string;
    imdbVotes: string;

    totalSeasons?: string;
    seasons?: SeasonModel;

    BoxOffice?: string;
    DVD?: string;
    Production?: string;
    Website: string;
    
}