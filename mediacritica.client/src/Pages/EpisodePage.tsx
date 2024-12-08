import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { BeatLoader } from "react-spinners";
import TopBar from "../Components/TopBar";
import { AutoTextSize } from "auto-text-size";
import { GetEpisode } from "../Server/Server";
import StarRating from "../Components/StarRating";
import { Rating } from "@mui/material";
import { ConvertRatingStringToFiveScale } from "../Helpers/StringHelper";
import "./EpisodePage.scss";

function EpisodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [episode, setEpisode] = useState<EpisodeModel>({} as EpisodeModel);

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
        <div className="episode empty">
          <div className="loader">
            <BeatLoader
              speedMultiplier={0.5}
              color="rgba(151, 18, 18, 1)"
              size={20}
            />
          </div>
        </div>
      ) : (
        <div className="episode">
          <TopBar blankReturn blankAccount />
          <div
            className="episode-poster"
            style={{
              backgroundImage: `url(${episode.Poster})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
            }}
          >
            <div className="episode-title">
              <AutoTextSize className="my-auto" maxFontSizePx={80}>
                {episode.Title}
              </AutoTextSize>
            </div>
          </div>
          <div className="episode-details">
            <div className="episode-title flex justify-between basis-full px-5">
              {location.state.seriesTitle} | S{episode.Season}:E
              {episode.Episode}
              <StarRating
                rating={episode.imdbRating}
                reviews={episode.imdbVotes}
                mediaId={episode.imdbID}
              />
            </div>
            <div className="episode-detail">
              <div className="text-lg">{episode.Plot}</div>
              <div className="flex justify-between">
                <div>Inital Release: {episode.Released}</div>
                <div>
                  {episode.Runtime}(s) | {episode.Year}
                </div>
              </div>
            </div>

            <div className="episode-detail">
              <div>Actors: {episode.Actors} </div>
              <div>Director(s): {episode.Director}</div>
              <div>Writers(s): {episode.Writer}</div>
            </div>

            <div className="episode-detail">
              <div>Genre: {episode.Genre}</div>
              <div>Language: {episode.Language}</div>
              <div>Country: {episode.Country}</div>
              <div>Rated: {episode.Rated}</div>
            </div>

            <div className="episode-detail">
              {episode.Metascore !== "N/A" && (
                <div className="flex">
                  Metascore:
                  <div className="my-auto">
                    <Rating
                      precision={0.1}
                      value={ConvertRatingStringToFiveScale(episode.Metascore)}
                      readOnly
                    />
                  </div>
                </div>
              )}
              {episode.Ratings.map((rating) => {
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
          </div>
        </div>
      )}
    </div>
  );
}

export default EpisodePage;
