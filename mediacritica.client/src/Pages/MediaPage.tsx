import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import {
  CapitaliseFirstLetter,
  ConvertRatingStringToFiveScale,
} from "../Helpers/StringHelper";
import { SeasonModel } from "../Interfaces/SeasonModel";
import TopBar from "../Components/TopBar";
import { IconButton, MenuItem, Rating, Select } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import {
  DeleteBacklog,
  GetMedia,
  GetSeason,
  PostBacklog,
} from "../Server/Server";
import { MediaType } from "../Enums/MediaType";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { MovieModel } from "../Interfaces/MovieModel";
import StarRating from "../Components/StarRating";
import { GameModel } from "../Interfaces/GameModel";
import {
  faHeart as faHeartReg,
  faImage,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { Snackbar } from "../Components/Snackbar";
import "./MediaPage.scss";
import { CustomTooltip } from "../Components/Tooltip";

function MediaPage() {
  const [media, setMedia] = useState<MovieModel | SeriesModel>(
    {} as MovieModel | SeriesModel
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const mediaId = location.state?.mediaId;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [user, setUser] = useRecoilState(userState);
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

  async function AddToBacklog() {
    const backlog = {
      userId: user.id,
      mediaId: media.imdbID,
      mediaType: media.Type,
      mediaPoster: media.Poster,
      mediaTitle: media.Title,
    } as unknown as BacklogModel;

    const newBacklogSummary = await PostBacklog(backlog);

    setUser({
      ...user,
      backlogSummary: [...user.backlogSummary, newBacklogSummary],
      totalBacklogs: user.totalBacklogs + 1,
    });

    Snackbar(`${media.Title} added to Backlog`, "success");
  }

  async function RemoveFromBacklog() {
    await DeleteBacklog(media.imdbID, user.id);

    setUser({
      ...user,
      backlogSummary: user.backlogSummary.filter(
        (backlog) => backlog.mediaId !== media.imdbID
      ),
      totalBacklogs: user.totalBacklogs - 1,
    });

    Snackbar(`${media.Title} removed from Backlog`, "success");
  }

  function GetUniqueMovieDetails() {
    let movie = media as MovieModel | GameModel;
    return (
      <div className="card">
        <h3>Additional Information</h3>
        <p>Runtime: {movie.Runtime}</p>
        <p>Box Office: {movie.BoxOffice}</p>
        <p>DVD: {movie.DVD}</p>
        <p>Production: {movie.Production}</p>
        <p>Website: {movie.Website}</p>
      </div>
    );
  }

  function GetUniqueSeriesDetails() {
    let series = media as SeriesModel;
    return (
      <div className="season-details">
        <div className="season-header">
          <h2>Season {selectedSeason} Episodes</h2>
          <div className="season-selector">
            <Select
              className="season-select"
              variant="standard"
              value={selectedSeason}
              onChange={(e) => ChangeSelectedSeason(e.target.value as number)}
              fullWidth
            >
              {GetSeasonOptions().map((seasonOption) => {
                return seasonOption;
              })}
            </Select>
          </div>
        </div>
        <div className="episode-cards">
          {series.seasons
            .find((season) => Number(season.Season) === selectedSeason)
            ?.Episodes.filter((episode) => episode.Episode !== "0")
            .map((episode) => {
              return (
                <div
                  className="episode-card"
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
                  <div className="episode-number">{episode.Episode}</div>
                  <div className="episode-info">
                    <h3>{episode.Title}</h3>
                    <p>
                      Released:{" "}
                      {episode.Released !== "N/A"
                        ? format(new Date(episode.Released), "do MMM yyyy")
                        : episode.Released}
                    </p>
                    <p>
                      Rating:{" "}
                      <span>
                        <FontAwesomeIcon className="star-icon" icon={faStar} />{" "}
                      </span>
                      {episode.imdbRating}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
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
          {media.Poster !== "N/A" ? (
            <img className="media-poster" src={media.Poster}></img>
          ) : (
            <div className="media-poster empty">
              <FontAwesomeIcon icon={faImage} />
            </div>
          )}
          <div className="info">
            <TopBar topbarColor="rgba(151, 18, 18, 1)" />
            <div className="hero">
              <div className="title-section">
                <div className="flex items-center gap-5 flex-wrap justify-center">
                  <h1>{media.Title}</h1>
                  {user.backlogSummary?.some(
                    (backlog) => backlog.mediaId === media.imdbID
                  ) ? (
                    <CustomTooltip title="Remove from backlog" arrow>
                      <span>
                        <IconButton
                          className="heart"
                          onClick={() => RemoveFromBacklog()}
                        >
                          <FontAwesomeIcon icon={faHeartSolid} />
                        </IconButton>
                      </span>
                    </CustomTooltip>
                  ) : (
                    <CustomTooltip
                      title={
                        user.id === null || user === undefined
                          ? "Login to update backlog status"
                          : "Add to backlog"
                      }
                      arrow
                    >
                      <span>
                        <IconButton
                          className="heart"
                          disabled={user.id === null || user === undefined}
                          onClick={() => AddToBacklog()}
                        >
                          <FontAwesomeIcon icon={faHeartReg} />
                        </IconButton>
                      </span>
                    </CustomTooltip>
                  )}
                </div>
                <div className="release">
                  <div>Initial Release: {media.Released}</div>
                  <div>
                    {CapitaliseFirstLetter(media.Type)}: {media.Year}
                  </div>
                </div>
              </div>
              <StarRating
                rating={media.imdbRating}
                reviews={media.imdbVotes}
                media={media}
              />
            </div>
            <div className="details">
              <div className="summary">
                <h2>{CapitaliseFirstLetter(media.Type)} Synopsis</h2>
                <p>{media.Plot}</p>
              </div>

              <div className="grid">
                <div className="card">
                  <h3>Cast</h3>
                  <div className="inline-grid grid-cols-2 gap-3 mt-4 w-full">{media.Actors.split(",").map((actor) => {
                    return <p className="m-0" key={actor}>{actor}</p>;
                  })}</div>
                </div>
                <div className="card">
                  <h3>Details</h3>
                  <p>Genre: {media.Genre}</p>
                  <p>Language: {media.Language}</p>
                  <p>Country: {media.Country}</p>
                  <p>Rated: {media.Rated}</p>
                </div>

                {(media.Writer !== "N/A" || media.Director !== "N/A") && (
                  <div className="card">
                    <h3>Writers & Directors</h3>
                    {media.Writer !== "N/A" && <p>Writer(s) {media.Writer}</p>}
                    {media.Director !== "N/A" && (
                      <p>Director(s): {media.Director}</p>
                    )}
                  </div>
                )}

                <div className="card">
                  <h3>Awards</h3>
                  <p>{media.Awards}</p>
                </div>
                <div className="card">
                  <h3>Ratings</h3>
                  {media.Metascore !== "N/A" && (
                    <p className="flex items-center gap-2">
                      Metascore:{" "}
                      <div className="rating">
                        <Rating
                          precision={0.1}
                          value={ConvertRatingStringToFiveScale(
                            media.Metascore
                          )}
                          readOnly
                        />
                      </div>
                    </p>
                  )}
                  {media.Ratings.map((rating) => {
                    return (
                      <p
                        className="flex items-center gap-2"
                        key={rating.Source}
                      >
                        {rating.Source}:{" "}
                        <div className="rating">
                          <Rating
                            precision={0.5}
                            value={ConvertRatingStringToFiveScale(rating.Value)}
                            readOnly
                          />
                        </div>
                      </p>
                    );
                  })}
                </div>
                {media.Type === MediaType.Movie && GetUniqueMovieDetails()}
              </div>

              {media.Type === MediaType.Series && GetUniqueSeriesDetails()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaPage;
