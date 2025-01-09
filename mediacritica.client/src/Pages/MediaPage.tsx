import "./MediaPage.scss";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CapitaliseFirstLetter,
  ConvertRatingStringToFiveScale,
} from "../Helpers/StringHelper";
import TopBar from "../Components/TopBar";
import { IconButton, MenuItem, Rating, Select } from "@mui/material";
import { format, formatDistanceToNowStrict } from "date-fns";
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
import { BacklogModel } from "../Interfaces/BacklogModel";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { Snackbar } from "../Components/Snackbar";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";

function MediaPage() {
  const [media, setMedia] = useState<MovieModel | SeriesModel | GameModel>(
    {} as MovieModel | SeriesModel | GameModel
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const mediaId = location.state?.mediaId;
  const mediaType = location.state.mediaType;
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  useEffect(() => {
    async function FetchMedia() {
      (mediaId === undefined || mediaType === undefined) && navigate("/");
      setIsLoading(true);
      var mediaResponse = await GetMedia(mediaId, mediaType);
      setMedia(mediaResponse);
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
        (season) => Number(season.season) === selectedSeason
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
      mediaId: media.id,
      mediaType: media.type,
      mediaPoster: media.poster,
      mediaTitle: media.title,
      addedDate: new Date(),
    } as unknown as BacklogModel;

    const newBacklogSummary = await PostBacklog(backlog);

    setUser({
      ...user,
      backlogSummary: [...user.backlogSummary, newBacklogSummary],
      totalBacklogs: user.totalBacklogs + 1,
    });

    Snackbar(`${media.title} added to Backlog`, "success");
  }

  async function RemoveFromBacklog() {
    await DeleteBacklog(media.id, user.id);

    setUser({
      ...user,
      backlogSummary: user.backlogSummary.filter(
        (backlog) => backlog.mediaId !== media.id
      ),
      totalBacklogs: user.totalBacklogs - 1,
    });

    Snackbar(`${media.title} removed from Backlog`, "success");
  }

  function GetUniqueMovieDetails() {
    let movie = media as MovieModel | GameModel;
    return (
      <div className="card">
        <h3>Additional Information</h3>
        <p>Runtime: {movie.runtime}</p>
        <p>Box Office: {movie.boxOffice}</p>
        <p>DVD: {movie.dvd}</p>
        <p>Production: {movie.production}</p>
        <p>Website: {movie.website}</p>
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
            .find((season) => Number(season.season) === selectedSeason)
            ?.episodes.filter((episode) => episode.episode !== "0")
            .map((episode) => {
              return (
                <div
                  key={episode.id}
                  className="episode-card"
                  onClick={() =>
                    navigate(
                      `seasons/${selectedSeason}/episodes/${episode.id}`,
                      {
                        state: {
                          episodeId: episode.id,
                          series: series as SeriesModel,
                        },
                      }
                    )
                  }
                >
                  <div className="episode-number">{episode.episode}</div>
                  <div className="episode-info">
                    <h3>{episode.title}</h3>
                    <p>
                      Released:{" "}
                      {episode.released !== "N/A"
                        ? format(new Date(episode.released), "do MMM yyyy")
                        : episode.released}
                    </p>
                    <p className="rating">
                      Rating: <StarIcon className="star-icon" />{" "}
                      {episode.imdbRating === "" ? "N/A" : episode.imdbRating}
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
        <Loader />
      ) : (
        <div className="media">
          <TopBar whiteText />
          {media.poster !== "N/A" ? (
            <img
              className="media-poster"
              src={media.poster.replace("300.jpg", "752.jpg")}
            ></img>
          ) : (
            <div className="media-poster empty">
              <ImageIcon />
            </div>
          )}
          <div className="info">
            <div className="hero">
              <div className="title-section">
                <div className="title flex items-center gap-5 flex-wrap">
                  <h1>{media.title}</h1>
                  {user.backlogSummary?.some(
                    (backlog) => backlog.mediaId === media.id
                  ) ? (
                    <CustomTooltip title="Remove from backlog" arrow>
                      <span>
                        <IconButton
                          className="heart"
                          onClick={() => RemoveFromBacklog()}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </span>
                    </CustomTooltip>
                  ) : (
                    <CustomTooltip
                      title={
                        user.id === undefined
                          ? "Login to update backlog status"
                          : "Add to backlog"
                      }
                      arrow
                    >
                      <span>
                        <IconButton
                          className="heart"
                          disabled={user.id === undefined}
                          onClick={() => AddToBacklog()}
                        >
                          <FavoriteBorderIcon />
                        </IconButton>
                      </span>
                    </CustomTooltip>
                  )}
                </div>
                <div className="release">
                  <div>Initial Release: {media.released}</div>
                  <div>
                    {CapitaliseFirstLetter(media.type)}: {media.year}
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
                <h2>{CapitaliseFirstLetter(media.type)} Synopsis</h2>
                <p>{media.plot}</p>
              </div>

              <div className="grid">
                <div className="card">
                  <h3>Cast</h3>
                  {media.actors.split(",").map((actor) => {
                    return <p key={actor}>{actor}</p>;
                  })}
                </div>
                <div className="card">
                  <h3>Details</h3>
                  <p>Genre: {media.genre}</p>
                  <p>Language: {media.language}</p>
                  <p>Country: {media.country}</p>
                  <p>Rated: {media.rated}</p>
                </div>

                {(media.writer !== "N/A" || media.director !== "N/A") && (
                  <div className="card">
                    <h3>Writers & Directors</h3>
                    {media.writer !== "N/A" && <p>Writer(s): {media.writer}</p>}
                    {media.director !== "N/A" && (
                      <p>Director(s): {media.director}</p>
                    )}
                  </div>
                )}

                {media.awards !== "N/A" && (
                  <div className="card">
                    <h3>Awards</h3>
                    <p>{media.awards}</p>
                  </div>
                )}

                {media.ratings.length > 0 ||
                  (media.metascore !== "" && (
                    <div className="card">
                      <h3>Ratings</h3>
                      {media.metascore !== "" && (
                        <p className="flex items-center gap-2">
                          Metascore:{" "}
                          <Rating
                            precision={0.1}
                            value={ConvertRatingStringToFiveScale(
                              media.metascore
                            )}
                            readOnly
                          />
                        </p>
                      )}
                      {media.ratings.map((rating) => {
                        return (
                          <p
                            className="flex items-center gap-2"
                            key={rating.source}
                          >
                            {rating.source}:{" "}
                            <Rating
                              precision={0.5}
                              value={ConvertRatingStringToFiveScale(
                                rating.value
                              )}
                              readOnly
                            />
                          </p>
                        );
                      })}
                    </div>
                  ))}
                {media.type === MediaType.Movie && GetUniqueMovieDetails()}
              </div>

              {media.reviews.length > 0 && (
                <div className="review-details">
                  <div className="review-header">
                    <h2>Reviews</h2>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate("reviews", {
                          state: {
                            mediaId: media.id,
                            mediaTitle: media.title,
                          },
                        })
                      }
                    >
                      View all <VisibilityIcon />
                    </button>
                  </div>
                  <div className="review-cards">
                    {media.reviews.map((review) => {
                      return (
                        <div
                          className="review-card"
                          key={review.id}
                          onClick={() =>
                            navigate(`view-review/${review.id}`, {
                              state: { reviewId: review.id },
                            })
                          }
                        >
                          <div className="rating">
                            <StarIcon className="icon" fontSize="large" />
                            {review.rating}
                          </div>
                          <div className="details">
                            <h3>{review.title}</h3>
                            <p>{review.reviewerName}</p>
                            <p>{formatDistanceToNowStrict(review.date)} ago</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {media.type === MediaType.Series && GetUniqueSeriesDetails()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaPage;
