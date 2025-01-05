import "./EpisodePage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import TopBar from "../Components/TopBar";
import { GetEpisode } from "../Server/Server";
import StarRating from "../Components/StarRating";
import { Rating } from "@mui/material";
import { ConvertRatingStringToFiveScale } from "../Helpers/StringHelper";
import { SeriesModel } from "../Interfaces/SeriesModel";
import Loader from "../Components/Loader";
import ImageIcon from '@mui/icons-material/ImageOutlined';

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
    <div className="episodepage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="episode">
          <TopBar whiteText />
          <div className="episode-info">
            <div className="flex flex-col gap-4">
              <h2>
                {series.title} | S{episode.season}:E
                {episode.episode} - {episode.title}
              </h2>
              <p className="meta">
                <span>Initial Release: {episode.released}</span> |{" "}
                <span>Duration: {episode.runtime}(s)</span> |{" "}
                <span>Rated: {episode.rated}</span>
              </p>
            </div>
            <div className="flex items-center flex-col gap-2 my-auto">
              <StarRating
                rating={episode.imdbRating}
                reviews={episode.imdbVotes}
                media={episode}
              />
            </div>
          </div>

          <div className="content">
            {episode.poster !== "N/A" ? (
              <div
                className="hero"
                style={{
                  backgroundImage: `url(${episode.poster.replace(
                    "300.jpg",
                    "1200.jpg"
                  )})`,
                }}
              />
            ) : (
              <div className="hero flex justify-center items-center">
                <ImageIcon className="text-9xl" />
              </div>
            )}

            <div className="summary">
              <h2>Episode Synopsis</h2>
              <p>{episode.plot}</p>
            </div>

            <div className="details-container">
              <div className="details-card">
                <h3>Details</h3>
                <p>Genre: {episode.genre}</p>
                <p>Language: {episode.language}</p>
                <p>Country: {episode.country}</p>
              </div>
              <div className="details-card">
                <h3>Cast</h3>
                <p>{episode.actors}</p>
              </div>
              <div className="details-card">
                <h3>Directors & Writers</h3>
                <p>Director(s):{episode.director}</p>
                <p>Writer(s): {episode.writer}</p>
              </div>

              {(episode.ratings.length > 0 || episode.metascore !== "") && (
                <div className="details-card">
                  <h3>Ratings</h3>
                  {episode.metascore !== "" && (
                    <p className="flex gap-4">
                      Metascore:{" "}
                      <Rating
                        precision={0.1}
                        value={ConvertRatingStringToFiveScale(
                          episode.metascore
                        )}
                        readOnly
                      />
                    </p>
                  )}
                  {episode.ratings.map((rating) => {
                    return (
                      <p className="flex gap-4" key={rating.source}>
                        {rating.source}:{" "}
                        <Rating
                          precision={0.1}
                          value={ConvertRatingStringToFiveScale(rating.value)}
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
  );
}

export default EpisodePage;
