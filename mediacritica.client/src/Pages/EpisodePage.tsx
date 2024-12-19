import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import TopBar from "../Components/TopBar";
import { GetEpisode } from "../Server/Server";
import StarRating from "../Components/StarRating";
import { Rating } from "@mui/material";
import { ConvertRatingStringToFiveScale } from "../Helpers/StringHelper";
import { SeriesModel } from "../Interfaces/SeriesModel";
import "./EpisodePage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import Loader from "../Components/Loader";

function EpisodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [episode, setEpisode] = useState<EpisodeModel>({} as EpisodeModel);
  const series = location.state?.series as SeriesModel;

  useEffect(() => {
    async function FetchEpisode() {
      location.state?.episodeId === undefined && navigate("/");
      setIsLoading(true);
      var episodeResponse = await GetEpisode(location.state.episodeId);
      setEpisode(episodeResponse);
      setIsLoading(false);
    }
    FetchEpisode();
  }, []);

  return (
    <>
      <div className="episodepage-container">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="episode">
            <TopBar topbarColor="rgba(151, 18, 18, 1)" />
            <div className="episode-info">
              <div className="flex flex-col gap-4">
                <h2>
                  {series.Title} | S{episode.Season}:E
                  {episode.Episode} - {episode.Title}
                </h2>
                <p className="meta">
                  <span>Initial Release: {episode.Released}</span> |{" "}
                  <span>Duration: {episode.Runtime}(s)</span> |{" "}
                  <span>Rated: {episode.Rated}</span>
                </p>
              </div>
              <div className="flex items-center flex-col gap-2 my-auto">
                <StarRating
                  rating={episode.imdbRating}
                  reviews={episode.imdbVotes}
                  media={episode}
                  parent={series}
                />
              </div>
            </div>

            <div className="content">
              {episode.Poster !== "N/A" ? (
                <div
                  className="hero"
                  style={{ backgroundImage: `url(${episode.Poster})` }}
                />
              ) : (
                <div className="hero flex justify-center items-center">
                  <FontAwesomeIcon className="text-9xl" icon={faImage} />
                </div>
              )}

              <div className="summary">
                <h2>Episode Synopsis</h2>
                <p>{episode.Plot}</p>
              </div>

              <div className="details-container">
                <div className="details-card">
                  <h3>Details</h3>
                  <p>Genre: {episode.Genre}</p>
                  <p>Language: {episode.Language}</p>
                  <p>Country: {episode.Country}</p>
                </div>
                <div className="details-card">
                  <h3>Cast</h3>
                  <p>{episode.Actors}</p>
                </div>
                <div className="details-card">
                  <h3>Directors & Writers</h3>
                  <p>Director(s):{episode.Director}</p>
                  <p>Writer(s): {episode.Writer}</p>
                </div>

                {(episode.Ratings.length > 0 ||
                  episode.Metascore !== "N/A") && (
                  <div className="details-card">
                    <h3>Ratings</h3>
                    {episode.Metascore !== "N/A" && (
                      <p className="flex gap-4">
                        Metascore:{" "}
                        <Rating
                          precision={0.1}
                          value={ConvertRatingStringToFiveScale(
                            episode.Metascore
                          )}
                          readOnly
                        />
                      </p>
                    )}
                    {episode.Ratings.map((rating) => {
                      return (
                        <p className="flex gap-4" key={rating.Source}>
                          {rating.Source}:{" "}
                          <Rating
                            precision={0.1}
                            value={ConvertRatingStringToFiveScale(rating.Value)}
                            readOnly
                          />
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EpisodePage;
