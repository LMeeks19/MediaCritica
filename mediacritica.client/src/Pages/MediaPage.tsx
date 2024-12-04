import { ReactNode, useEffect, useState } from "react";
import { MediaModel } from "../Interfaces/MediaModel";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { SeasonModel } from "../Interfaces/SeasonModel";
import TopBar from "../Components/TopBar";
import {
  MenuItem,
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
import "../Style/MediaPage.scss";
import { GetMedia, GetSeason } from "../Server/Server";

function MediaPage() {
  const [media, setMedia] = useState<MediaModel>({} as MediaModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const mediaId = location.state?.mediaId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function FetchMedia() {
      setIsLoading(true);
      var mediaResponse = await GetMedia(mediaId);
      var mediaSeasonsResponse = [] as SeasonModel[];
      if (mediaResponse.totalSeasons !== undefined) {
        let mediaSeasonResponse = await GetSeason(mediaId);
        mediaSeasonsResponse.push(mediaSeasonResponse);
      }
      setMedia({ ...mediaResponse, seasons: mediaSeasonsResponse });
      setIsLoading(false);
    }
    FetchMedia();
  }, []);

  function GetSeasonOptions(): ReactNode[] {
    let seasonOptions = [] as ReactNode[];
    for (let season = 1; season <= Number(media.totalSeasons); season++) {
      seasonOptions.push(
        <MenuItem key={season} value={Number(season)}>
          Season {season}
        </MenuItem>
      );
    }
    return seasonOptions;
  }

  async function ChangeSelectedSeason(selectedSeason: number) {
    if (
      !media.seasons?.some((season) => Number(season.Season) === selectedSeason)
    ) {
      let mediaSeasonResponse = await GetSeason(mediaId, selectedSeason);
      setMedia({ ...media, seasons: [...media.seasons!, mediaSeasonResponse] });
    }

    setSelectedSeason(selectedSeason);
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
          <TopBar accountBlank={false} />
          <img className="media-poster" src={media.Poster}></img>
          <div className="media-details">
            <div className="text-6xl text-center my-5">{media.Title}</div>
            <div className="details-section section-2">
              <div className="flex justify-between flex-row">
                <div>Initial Release: {media.Released}</div>
                <div>
                  {CapitaliseFirstLetter(media.Type)} | {media.Year}
                </div>
              </div>
              <div>{media.Plot}</div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="details-section flex justify-around flex-col w-1/2">
                <div>Actors: {media.Actors}</div>
                <div>Directos(s): {media.Director}</div>
                <div>Writer(s): {media.Writer}</div>
              </div>

              <div className="details-section flex justify-around flex-col w-1/2">
                <div>Runtime: {media.Runtime}</div>
                <div>Genre: {media.Genre}</div>
                <div>Language: {media.Language}</div>
                <div>Country: {media.Country}</div>
                <div>Rated: {media.Rated}</div>
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="details-section flex justify-around flex-col w-1/2">
                <div>Metascore: {media.Metascore}</div>
                <div>
                  IMDb: {media.imdbRating} | {media.imdbVotes} Reviews
                </div>
                {media.Ratings.map((rating) => {
                  return (
                    <div key={rating.Source}>
                      {rating.Source}: {rating.Value}
                    </div>
                  );
                })}
              </div>

              {media.BoxOffice !== undefined ||
              media.Awards !== undefined ||
              media.DVD !== undefined ||
              media.Production !== undefined ||
              media.Website !== undefined ? (
                <div className="details-section flex justify-around flex-col w-1/2">
                  {media.BoxOffice !== undefined ? (
                    <div>Box Office: {media.BoxOffice}</div>
                  ) : (
                    <></>
                  )}
                  {media.Awards !== undefined ? (
                    <div>Awards: {media.Awards}</div>
                  ) : (
                    <></>
                  )}
                  {media.DVD !== undefined ? (
                    <div>DVD: {media.DVD}</div>
                  ) : (
                    <></>
                  )}
                  {media.Production !== undefined ? (
                    <div>Production: {media.Production}</div>
                  ) : (
                    <></>
                  )}
                  {media.Website !== undefined ? (
                    <div>Website: {media.Website}</div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div style={{ marginTop: "20px" }}>
              {media.seasons !== undefined &&
              media.totalSeasons !== undefined ? (
                <Table key={selectedSeason}>
                  <TableHead>
                    <TableRow>
                      <TableCell className="table-title" colSpan={2}>
                        Season {selectedSeason}
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Select
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
                    {media.seasons
                      .find(
                        (season) => Number(season.Season) === selectedSeason
                      )
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
                                  },
                                }
                              )
                            }
                          >
                            <TableCell>{episode.Episode}</TableCell>
                            <TableCell>{episode.Title}</TableCell>
                            <TableCell>
                              {episode.Released !== "N/A"
                                ? format(
                                    new Date(episode.Released),
                                    "do MMM yyyy"
                                  )
                                : episode.Released}
                            </TableCell>
                            <TableCell align="center">
                              <FontAwesomeIcon
                                className="star-icon"
                                icon={faStar}
                              />
                              {episode.imdbRating}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaPage;
