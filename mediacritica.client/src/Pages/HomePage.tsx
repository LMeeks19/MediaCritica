import { useEffect, useState } from "react";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import {
  CapitaliseFirstLetter,
  MediaYearFormatter,
} from "../Helpers/StringHelper";
import { BeatLoader } from "react-spinners";
import $ from "jquery";
import { AutoTextSize } from "auto-text-size";
import "../Style/HomePage.scss";

function HomePage() {
  const mediaServiceApiKey = import.meta.env.VITE_SERVICE_API_KEY;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSerarchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      var mediaSearchResponse = (await fetch(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=${mediaServiceApiKey}`
      ).then((response) => response.json())) as MediaSearchResponse;
      setMediaSearchResults(mediaSearchResponse.Search ?? []);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  function scrollTitleIfOverflowing(id: string) {
    let element = $(`#${id}`);
    let info = element.find(".homepage-result-details");
    let title = info.find(".result-details-title");
    title.stop();
    title.animate({ scrollLeft: 1000 }, 8000, function () {});
  }

  function unscrollTitleIfOverflowing(id: string) {
    let element = $(`#${id}`);
    let info = element.find(".homepage-result-details");
    let title = info.find(".result-details-title");
    title.stop();
    title.animate({ scrollLeft: -1000 }, 8000, function () {});
  }

  return (
    <div className="homepage-container">
      <div className="homepage-title">
        <AutoTextSize mode="multiline">MEDIA CRITICA</AutoTextSize>
      </div>
      <div className="homepage-searchbar">
        <input
          className="homepage-input"
          value={searchTerm}
          onChange={(e) => setSerarchTerm(e.target.value)}
        />
        <div className="homepage-icons">
          {searchTerm.length > 0 ? (
            <i
              className="homepage-clear fa-solid fa-times fa-2xl"
              onClick={() => setSerarchTerm("")}
            />
          ) : (
            <></>
          )}
          <i className="fa-solid fa-magnifying-glass fa-xl fa-flip-horizontal" />
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
                onMouseOver={() =>
                  scrollTitleIfOverflowing(mediaSearchResult.imdbID)
                }
                onMouseOut={() =>
                  unscrollTitleIfOverflowing(mediaSearchResult.imdbID)
                }
              >
                {mediaSearchResult.Poster !== "N/A" ? (
                  <img
                    draggable="false"
                    className="homepage-result-image"
                    src={mediaSearchResult.Poster}
                  ></img>
                ) : (
                  <div className="homepage-result-image empty">
                    <i className="fa-regular fa-image"></i>
                  </div>
                )}
                <div className="homepage-result-details">
                  <div className="result-details-title">
                    {mediaSearchResult.Title}
                  </div>
                  <div className="result-sub-details">
                    <div className="result-details-type">
                      {CapitaliseFirstLetter(mediaSearchResult.Type)}
                    </div>
                    <div className="result-details-year">
                      {MediaYearFormatter(mediaSearchResult.Year)}
                    </div>
                  </div>
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
            "No Results Found"
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
