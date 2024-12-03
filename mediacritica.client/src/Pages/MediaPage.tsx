import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { serviceApiKeyState, userState } from "../State/GlobalState";
import { MediaModel } from "../Interfaces/MediaModel";
import { useLocation, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import "../Style/MediaPage.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { SeasonModel } from "../Interfaces/SeasonModel";

function MediaPage() {
  const mediaServiceApiKey = useRecoilValue(serviceApiKeyState);
  const user = useRecoilValue(userState);
  const [media, setMedia] = useState<MediaModel>({} as MediaModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const mediaId = location.state?.mediaId;

  useEffect(() => {
    async function FetchMedia() {
      setIsLoading(true);
      var mediaResponse = (await fetch(
        `https://www.omdbapi.com/?i=${mediaId}&plot=full&apikey=${mediaServiceApiKey}`
      ).then((response) => response.json())) as MediaModel;
      var mediaSeasonsResponse = [] as SeasonModel[];
      for (
        let season = 1;
        season <= Number(mediaResponse.totalSeasons);
        season++
      ) {
        let mediaSeasonResponse = (await fetch(
          `https://www.omdbapi.com/?i=${mediaId}&season=${season}&apikey=${mediaServiceApiKey}`
        ).then((response) => response.json())) as SeasonModel;
        mediaSeasonsResponse.push(mediaSeasonResponse);
      }
      setMedia(mediaResponse);
      setIsLoading(false);
    }
    FetchMedia();
  }, []);

  return (
    <div
      className="mediapage-container"
      style={{
        backgroundImage: `url(${media.Poster})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "40% 100%",
      }}
    >
      <div className="mediapage-return" onClick={() => navigate("/")}>
        <i className="fa-solid fa-caret-left"></i>
        <div className="return-text">MEDIA CRITICA</div>
      </div>
      <div
        className="mediapage-account"
        onClick={() => {
          if (user.Email === undefined) {
            navigate("/login");
          } else {
            navigate("/account");
          }
        }}
      >
        {user.Email === undefined ? (
          <div className="account-text">SIGN IN</div>
        ) : (
          <div className="account-text">ACCOUNT</div>
        )}
        <i className="fa-regular fa-circle-user"></i>
      </div>
      {isLoading ? (
        <div className="loader">
          <BeatLoader
            speedMultiplier={0.5}
            color="rgba(151, 18, 18, 1)"
            size={20}
          />
        </div>
      ) : (
        <div className="media-details">
          <div>{media.Title}</div>
          <div>{CapitaliseFirstLetter(media.Type)}</div>
          <div>{media.Plot}</div>
          <div>{media.Actors}</div>
          <div>{media.Awards}</div>
        </div>
      )}
    </div>
  );
}

export default MediaPage;
