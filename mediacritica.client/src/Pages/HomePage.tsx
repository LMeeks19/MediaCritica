import { useEffect, useState } from "react";
import { MediaSearchModel } from "../Interfaces/MediaSearchModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { CustomTooltip } from "../Components/Tooltip";
import { GetSearchResults } from "../Server/Server";
import TopBar from "../Components/TopBar";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import "./HomePage.scss";
import Loader from "../Components/Loader";

function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSerarchTerm] = useState<string>("");
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [mediaSearchResults, setMediaSearchResults] = useState<
    MediaSearchModel[]
  >([] as MediaSearchModel[]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      if (searchTerm.length > 0) {
        var mediaSearchResponse = await GetSearchResults(searchTerm);
        setTotalResults(Number(mediaSearchResponse.totalResults));
        setMediaSearchResults(mediaSearchResponse.Search ?? []);
      } else {
        setMediaSearchResults([]);
      }
      setPage(1);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  async function LoadMoreResults() {
    setIsLoading(true);
    var mediaSearchResponse = await GetSearchResults(searchTerm, page + 1);
    setMediaSearchResults([
      ...mediaSearchResults,
      ...(mediaSearchResponse.Search ?? []),
    ]);
    setPage(page + 1);
    setIsLoading(false);
  }

  return (
    <div className="homepage-container">
      <div className="homepage">
        <TopBar hideReturn />
        <div className="homepage-title">MEDIA CRITICA</div>
        <div className="homepage-searchbar">
          <FontAwesomeIcon
            className="icon"
            icon={faMagnifyingGlass}
            flip="horizontal"
          />
          <input
            className="homepage-input"
            value={searchTerm}
            onChange={(e) => setSerarchTerm(e.target.value)}
            placeholder="Search for media..."
          />
          {searchTerm.length > 0 && (
            <CustomTooltip title="Clear Search" arrow>
              <FontAwesomeIcon
                className="icon clear"
                icon={faTimes}
                flip="horizontal"
                onClick={() => setSerarchTerm("")}
              />
            </CustomTooltip>
          )}
        </div>
        {mediaSearchResults.length > 0 ? (
          <div className="overflow-y-auto flex flex-col items-center">
            <div className="homepage-results">
              {mediaSearchResults.map((mediaSearchResult) => {
                return (
                  <div
                    className="media"
                    key={mediaSearchResult.imdbID}
                    onClick={() =>
                      navigate(`/media/${mediaSearchResult.imdbID}`, {
                        state: {
                          mediaId: mediaSearchResult.imdbID,
                        },
                      })
                    }
                  >
                    <div className="tag type">
                      {CapitaliseFirstLetter(mediaSearchResult.Type)}
                    </div>
                    {mediaSearchResult.Poster === "N/A" ? (
                      <div className="image empty">
                        <FontAwesomeIcon icon={faImage} />
                      </div>
                    ) : (
                      <img className="image" src={mediaSearchResult.Poster} />
                    )}
                    <div className="title">{mediaSearchResult.Title}</div>
                  </div>
                );
              })}
            </div>
            <CustomTooltip
              title={
                mediaSearchResults.length === totalResults && "All media loaded"
              }
              arrow
            >
              <span>
                <button
                  className="load-btn"
                  disabled={mediaSearchResults.length >= totalResults}
                  onClick={() => LoadMoreResults()}
                >
                  Load More <FontAwesomeIcon icon={faSpinner} />
                </button>
              </span>
            </CustomTooltip>
          </div>
        ) : isLoading ? (
          <Loader />
        ) : (
          <div className="homepage-results empty">
            {searchTerm.length > 0 ? "No Media Found" : "Type To Begin Search"}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
