import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
  CapitaliseFirstLetter,
  ConvertRatingStringToFiveScale,
} from "../Helpers/StringHelper";
import { SeasonModel } from "../Interfaces/SeasonModel";
import TopBar from "../Components/TopBar";
import {
  MenuItem,
  Rating,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { GetMedia, GetSeason } from "../Server/Server";
import { MediaType } from "../Enums/MediaType";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { MovieModel } from "../Interfaces/MovieModel";
import StarRating from "../Components/StarRating";
import "./MediaPage.scss";

function MediaPage() {
  const [media, setMedia] = useState<MovieModel | SeriesModel>(
    {} as MovieModel | SeriesModel
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const mediaId = location.state?.mediaId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function FetchMedia() {
      mediaId === undefined && navigate("/");
      setIsLoading(true);
      var mediaResponse = await GetMedia(mediaId);
      var mediaSeasonsResponse = [] as SeasonModel[];
      if (mediaResponse.Type === MediaType.Series) {
        let mediaSeasonResponse = await GetSeason(mediaId);
        mediaSeasonsResponse.push(mediaSeasonResponse);
      }
      setMedia({ ...mediaResponse, seasons: mediaSeasonsResponse });
      setIsLoading(false);
    }
    FetchMedia();
  }, []);

  function GetSeasonOptions(): ReactNode[] {
    let series = media as SeriesModel;
    let seasonOptions = [] as ReactNode[];
    for (let season = 1; season <= Number(series.totalSeasons); season++) {
      seasonOptions.push(
        <MenuItem key={season} value={Number(season)}>
          Season {season}
        </MenuItem>
      );
    }
    return seasonOptions;
  }

  async function ChangeSelectedSeason(selectedSeason: number) {
    let series = media as SeriesModel;
    if (
      !series.seasons?.some(
        (season) => Number(season.Season) === selectedSeason
      )
    ) {
      let mediaSeasonResponse = await GetSeason(mediaId, selectedSeason);
      setMedia({
        ...series,
        seasons: [...series.seasons!, mediaSeasonResponse],
      });
    }

    setSelectedSeason(selectedSeason);
  }

  function GetUniqueMovieDetails() {
    let movie = media as MovieModel;
    return (
      <div className="details-section">
        <div>Runtime: {media.Runtime}</div>
        <div>Box Office: {movie.BoxOffice}</div>
        <div>DVD: {movie.DVD}</div>
        <div>Production: {movie.Production}</div>
        <div>Website: {movie.Website}</div>
      </div>
    );
  }

  function GetUniqueSeriesDetails() {
    let series = media as SeriesModel;
    return (
      <div className="flex grow basis-full overflow-x-auto pb-5">
        <Table key={selectedSeason}>
          <TableHead>
            <TableRow>
              <TableCell className="table-title" colSpan={2}>
                Season {selectedSeason}
              </TableCell>
              <TableCell colSpan={2}>
                <Select
                  variant="standard"
                  value={selectedSeason}
                  onChange={(e) =>
                    ChangeSelectedSeason(e.target.value as number)
                  }
                  fullWidth
                >
                  {GetSeasonOptions().map((seasonOption) => {
                    return seasonOption;
                  })}
                </Select>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Episode</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Released</TableCell>
              <TableCell align="center">Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {series.seasons
              .find((season) => Number(season.Season) === selectedSeason)
              ?.Episodes.filter((episode) => episode.Episode !== "0")
              .map((episode) => {
                return (
                  <TableRow
                    key={episode.imdbID}
                    component="tr"
                    onClick={() =>
                      navigate(
                        `seasons/${selectedSeason}/episodes/${episode.imdbID}`,
                        {
                          state: {
                            episodeId: episode.imdbID,
                            series: series as SeriesModel,
                          },
                        }
                      )
                    }
                  >
                    <TableCell>{episode.Episode}</TableCell>
                    <TableCell>{episode.Title}</TableCell>
                    <TableCell>
                      {episode.Released !== "N/A"
                        ? format(new Date(episode.Released), "do MMM yyyy")
                        : episode.Released}
                    </TableCell>
                    <TableCell align="center">
                      <FontAwesomeIcon className="star-icon" icon={faStar} />
                      {episode.imdbRating}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="mediapage-container">
      {isLoading ? (
        <div className="media empty">
          <div className="loader">
            <BeatLoader
              speedMultiplier={0.5}
              color="rgba(151, 18, 18, 1)"
              size={20}
            />
          </div>
        </div>
      ) : (
        <div className="media">
          <TopBar blankReturn />
          <img className="media-poster" src={media.Poster}></img>
          <div className="media-details">
            <div className="flex justify-between">
              <div className="text-6xl text-center my-10">{media.Title}</div>
              <StarRating
                rating={media.imdbRating}
                reviews={media.imdbVotes}
                media={media}
              />
            </div>
            <div className="flex flex-wrap gap-5">
              <div className="details-section basis-full gap-10">
                <div>{media.Plot}</div>
                <div className="flex justify-between flex-row ">
                  <div>Initial Release: {media.Released}</div>
                  <div>
                    {CapitaliseFirstLetter(media.Type)} | {media.Year}
                  </div>
                </div>
              </div>

              <div className="details-section">
                <div>Actors: {media.Actors}</div>
                <div>Directos(s): {media.Director}</div>
                <div>Writer(s): {media.Writer}</div>
              </div>

              <div className="details-section">
                <div>Genre: {media.Genre}</div>
                <div>Language: {media.Language}</div>
                <div>Country: {media.Country}</div>
                <div>Rated: {media.Rated}</div>
                <div>Awards: {media.Awards}</div>
              </div>

              <div className="details-section">
                {media.Metascore !== "N/A" && (
                  <div className="flex gap-2">
                    Metascore:
                    <div className="my-auto">
                      <Rating
                        precision={0.1}
                        value={ConvertRatingStringToFiveScale(media.Metascore)}
                        readOnly
                      />
                    </div>
                  </div>
                )}
                {media.Ratings.map((rating) => {
                  return (
                    <div className="flex gap-2" key={rating.Source}>
                      {rating.Source}:
                      <Rating
                        precision={0.1}
                        value={ConvertRatingStringToFiveScale(rating.Value)}
                        readOnly
                      />
                    </div>
                  );
                })}
              </div>

              {media.Type === MediaType.Movie
                ? GetUniqueMovieDetails()
                : GetUniqueSeriesDetails()}
            </div>
          </div>
        </div>
      )}
      ;
    </div>
  );
}

export default MediaPage;
