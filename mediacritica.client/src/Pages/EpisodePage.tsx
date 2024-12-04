import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { BeatLoader } from "react-spinners";
import TopBar from "../Components/TopBar";
import { AutoTextSize } from "auto-text-size";
import { GetEpisode } from "../Server/Server";
import "../Style/EpisodePage.scss";

function EpisodePage() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [episode, setEpisode] = useState<EpisodeModel>({} as EpisodeModel);

  useEffect(() => {
    async function FetchEpisode() {
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
          <TopBar accountBlank={true} />
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
          <div className="episode-details"></div>
        </div>
      )}
    </div>
  );
}

export default EpisodePage;
