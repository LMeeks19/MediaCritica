import { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { serviceApiKeyState, userState } from "../State/GlobalState";
import { MediaModel } from "../Interfaces/MediaModel";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { SeasonModel } from "../Interfaces/SeasonModel";
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

function MediaPage() {
  const mediaServiceApiKey = useRecoilValue(serviceApiKeyState);
  const user = useRecoilValue(userState);
  const [media, setMedia] = useState<MediaModel>({} as MediaModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const mediaId = location.state?.mediaId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function FetchMedia() {
      setIsLoading(true);
      var mediaResponse = (await fetch(
        `https://www.omdbapi.com/?i=${mediaId}&plot=full&apikey=${mediaServiceApiKey}`
      ).then((response) => response.json())) as MediaModel;
      var mediaSeasonsResponse = [] as SeasonModel[];
      if (mediaResponse.totalSeasons !== undefined) {
        let mediaSeasonResponse = (await fetch(
          `https://www.omdbapi.com/?i=${mediaId}&season=1&apikey=${mediaServiceApiKey}`
        ).then((response) => response.json())) as SeasonModel;
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
      let mediaSeasonResponse = (await fetch(
        `https://www.omdbapi.com/?i=${mediaId}&season=${selectedSeason}&apikey=${mediaServiceApiKey}`
      ).then((response) => response.json())) as SeasonModel;
      setMedia({ ...media, seasons: [...media.seasons!, mediaSeasonResponse] });
    }

    setSelectedSeason(selectedSeason);
  }

  return (
    <div className="mediapage-container">
      <div className="mediapage-topbar">
        <div className="mediapage-return" onClick={() => history.back()}>
          <div className="return-text">MEDIA CRITICA</div>
        </div>
        <div className="mediapage-account">
          <div className="account-text">
            {user.Email === undefined ? "SIGN IN" : "ACCOUNT"}
          </div>
        </div>
      </div>
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
          <img className="media-poster" src={media.Poster}></img>
          <div className="media-details">
            <div className="details-section">
              <div>{media.Title}</div>
              <div>{CapitaliseFirstLetter(media.Type)}</div>
            </div>
            <div className="details-section section-2">
              <div className="flex between row">
                <div>Initial Release: {media.Released}</div>
                <div>{media.Year}</div>
              </div>
              <div>{media.Plot}</div>
            </div>

            <div className="flex row gap-20">
              <div className="details-section flex column width-50">
                <div>Actors: {media.Actors}</div>
                <div>Directos(s): {media.Director}</div>
                <div>Writer(s): {media.Writer}</div>
              </div>

              <div className="details-section flex column width-50">
                <div>Runtime: {media.Runtime}</div>
                <div>Genre: {media.Genre}</div>
                <div>Language: {media.Language}</div>
                <div>Country: {media.Country}</div>
                <div>Rated: {media.Rated}</div>
              </div>
            </div>

            <div className="flex row gap-20">
              <div className="details-section flex column width-50">
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
                <div className="details-section flex column width-50">
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
