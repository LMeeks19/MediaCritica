import "./Collapsible.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";

const Collapsible = (props: CollapsibleProps) => {
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [media, setMedia] = useState<MediaSummaryModel[]>(
    [] as MediaSummaryModel[]
  );

  useEffect(() => {
    ExecuteRequest();
  }, []);

  function ExecuteRequest() {
    setIsLoading(true);
    const mediaData = props.request() as MediaSummaryModelResponse;
    setMedia(mediaData.mediaSummaryModels);
    setIsLoading(false);
  }

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="section">
      <div
        className={`sub-header collapsible ${isActive ? "active" : ""}`}
        onClick={handleToggle}
      >
        <h1>{props.title}</h1>
      </div>

      <div
        className="content"
        style={{
          display: isActive ? "block" : "none",
        }}
      >
        {isActive && isLoading ? (
          <Loader />
        ) : (
          <div className="media-grid">
            {media?.map((item) => {
              return (
                <div key={item.id} className="media-card">
                  <img
                    src={item.poster}
                    alt={`${item.title} poster`}
                    className="media-image"
                  />
                  <div className="media-title">{item.title}</div>
                  <div className="media-year">{item.released.toString()}</div>
                  <div className="media-year">
                    {CapitaliseFirstLetter(item.type)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collapsible;

interface CollapsibleProps {
  title: string;
  request: Function;
}
