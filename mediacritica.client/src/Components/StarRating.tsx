import { Rating } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import { CustomTooltip } from "./Tooltip";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import "./StarRating.scss";
import { MediaType } from "../Enums/MediaType";

function StarRating(props: StarRatingProps) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-col gap-2 my-auto">
      <Rating
        sx={{ fontSize: "2.5rem" }}
        value={Number(props.rating) / 2}
        precision={0.1}
        readOnly
      />
      <div className="text-base text-center flex gap-1">
        <CustomTooltip
          title={user.id === null ? "Login to review" : "Write a review"}
          arrow
        >
          <span hidden={props.media.Type === MediaType.Episode}>
            <button
              className="review-btn"
              onClick={() =>
                navigate(`/media/${props.media.imdbID}/write-review`, {
                  state: { media: props.media, parent: props.parent },
                })
              }
              disabled={user.id === null}
            >
              Review
            </button>
            {" | "}
          </span>
        </CustomTooltip>
        <div>{props.reviews} Reviews</div>
      </div>
    </div>
  );
}

export default StarRating;

interface StarRatingProps {
  rating: string;
  reviews: string;
  media: MovieModel | SeriesModel | EpisodeModel;
  parent?: SeriesModel;
}
