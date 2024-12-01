import { useEffect, useState } from "react";
import "../Style/HomePage.css";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { MediaSearchResponse } from "../Interfaces/MediaSearchResponse";
import {
  CapitaliseFirstLetter,
  MediaYearFormatter,
} from "../Helpers/StringHelper";

function HomePage() {
  const mediaServiceApiKey = import.meta.env.VITE_SERVICE_API_KEY;

  const [searchTerm, setSerarchTerm] = useState<string>("");
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      var mediaSearchResponse = (await fetch(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=${mediaServiceApiKey}`
      ).then((response) => response.json())) as MediaSearchResponse;
      setMediaSearchResults(mediaSearchResponse.Search ?? []);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <div className="homepage-container">
      <div className="homepage-title">MEDIA CRITICA</div>
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
      <div className="homepage-results">
        {mediaSearchResults.map((mediaSearchResult) => {
          return (
            <div className="homepage-result" key={mediaSearchResult.imdbID}>
              <img
                className="homepage-result-image"
                src={mediaSearchResult.Poster}
              ></img>
              <div className="homepage-result-details">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
