import { useEffect, useState } from "react";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import {
  CapitaliseFirstLetter,
  MediaYearFormatter,
} from "../Helpers/StringHelper";
import { BeatLoader } from "react-spinners";
import $ from "jquery";
import { AutoTextSize } from "auto-text-size";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { CustomTooltip } from "../Components/Tooltip";
import { GetSearchResults } from "../Server/Server";
import TopBar from "../Components/TopBar";
import "./HomePage.scss";
import { faImage } from "@fortawesome/free-regular-svg-icons";

function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSerarchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 0) {
        var mediaSearchResponse = await GetSearchResults(searchTerm);
        setMediaSearchResults(mediaSearchResponse.Search ?? []);
      } else {
        setMediaSearchResults([]);
      }
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  function scrollTitleIfOverflowing(id: string) {
    let element = $(`#${id}`);
    let title = element.find(".result-details-title");
    title.stop();
    title.animate({ scrollLeft: 1000 }, 8000, function () {});
  }

  function unscrollTitleIfOverflowing(id: string) {
    let element = $(`#${id}`);
    let title = element.find(".result-details-title");
    title.stop();
    title.animate({ scrollLeft: -1000 }, 8000, function () {});
  }

  return (
    <>
      <TopBar hideReturn />
      <div className="homepage-container">
        <div className="homepage-title">
          <AutoTextSize mode="oneline" minFontSizePx={30} maxFontSizePx={124}>
            MEDIA CRITICA
          </AutoTextSize>
        </div>
        <div className="homepage-searchbar">
          <div className="homepage-icon">
            <IconButton color="inherit" style={{ pointerEvents: "none" }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} flip="horizontal" />
            </IconButton>
          </div>
          <input
            className="homepage-input"
            value={searchTerm}
            onChange={(e) => setSerarchTerm(e.target.value)}
            placeholder="Search for media..."
          />
          <div className="homepage-icon">
            {searchTerm.length > 0 && (
              <IconButton color="inherit" size="large">
                <CustomTooltip title="Clear Search" arrow>
                  <FontAwesomeIcon
                    className="icon-clear"
                    icon={faTimes}
                    flip="horizontal"
                    onClick={() => setSerarchTerm("")}
                  />
                </CustomTooltip>
              </IconButton>
            )}
          </div>
        </div>
        {mediaSearchResults.length > 0 ? (
          <div className="homepage-results">
            {mediaSearchResults.map((mediaSearchResult) => {
              return (
                <div
                  className="homepage-result"
                  id={mediaSearchResult.imdbID}
                  key={mediaSearchResult.imdbID}
                  style={{
                    backgroundImage: `url(${mediaSearchResult.Poster})`,
                  }}
                  onMouseOver={() =>
                    scrollTitleIfOverflowing(mediaSearchResult.imdbID)
                  }
                  onMouseOut={() =>
                    unscrollTitleIfOverflowing(mediaSearchResult.imdbID)
                  }
                  onClick={() =>
                    navigate(`/media/${mediaSearchResult.imdbID}`, {
                      state: {
                        mediaId: mediaSearchResult.imdbID,
                      },
                    })
                  }
                >
                  {mediaSearchResult.Poster === "N/A" && (
                    <div className="result-image-empty">
                      <FontAwesomeIcon icon={faImage} />
                    </div>
                  )}
                  <div className="result-details-title">
                    {mediaSearchResult.Title}
                  </div>
                  <div className="result-details-type">
                    {CapitaliseFirstLetter(mediaSearchResult.Type)}
                  </div>
                  <div className="result-details-year">
                    {MediaYearFormatter(mediaSearchResult.Year)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="homepage-results empty">
            {isLoading ? (
              <BeatLoader
                color="rgba(151, 18, 18, 1)"
                size={20}
                speedMultiplier={0.5}
              />
            ) : (
              <div>
                {searchTerm.length > 0
                  ? "No Media Found"
                  : "Type To Begin Search"}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
