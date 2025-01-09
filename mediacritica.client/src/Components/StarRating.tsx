import "./StarRating.scss";
import { Rating } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import { CustomTooltip } from "./Tooltip";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";

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
      <div className="text-base text-center flex flex-col flex-wrap justify-center">
        {props.reviews !== "" && <div>{props.reviews} Reviews</div>}
        <CustomTooltip
          title={
            user.id !== undefined
              ? new Date(props.media.released).getTime() > new Date().getTime()
                ? "Media not out yet"
                : "Write a review"
              : "Login to review"
          }
          arrow
        >
          <span>
            <button
              className="review-btn"
              onClick={() =>
                navigate(`/media/${props.media.id}/write-review`, {
                  state: { media: props.media },
                })
              }
              disabled={
                user.id === undefined ||
                new Date(props.media.released).getTime() > new Date().getTime()
              }
            >
              Review
            </button>
          </span>
        </CustomTooltip>
      </div>
    </div>
  );
}

export default StarRating;

interface StarRatingProps {
  rating: string;
  reviews: string;
  media: MovieModel | SeriesModel | EpisodeModel;
}
