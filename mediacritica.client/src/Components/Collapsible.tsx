import "./Collapsible.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaSummaryModel } from "../Interfaces/MediaSummaryModel";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { MediaSummaryModelResponse } from "../Interfaces/MediaSummaryModelResponse";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { format } from "date-fns";

const Collapsible = (props: CollapsibleProps) => {
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(1);
  const [media, setMedia] = useState<MediaSummaryModel[]>(
    [] as MediaSummaryModel[]
  );

  useEffect(() => {
    ExecuteRequest();
  }, []);

  async function ExecuteRequest() {
    setIsLoading(true);
    const mediaData = (await props.request()) as MediaSummaryModelResponse;
    setMedia(mediaData.mediaSummaryModels);
    setTotalResults(mediaData.totalMediaCount);
    setIsLoading(false);
  }

  return (
    <div className="section">
      <div
        className="sub-header collapsible"
        onClick={() => setIsActive(!isActive)}
      >
        <h1>{props.title}</h1>
        {isActive ? <RemoveIcon /> : <AddIcon />}
      </div>

      <div
        className="content"
        style={{
          display: isActive ? "block" : "none",
        }}
      >
        {isActive && isLoading ? (
          <Loader />
        ) : media?.length === 0 ? (
          <div className="text-center">No Media</div>
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
                  <div className="media-year">
                    {format(item.released, "do MMM yyyy")}
                  </div>
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
