import { Rating } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import { CustomTooltip } from "./Tooltip";
import "./StarRating.scss";

function StarRating(props: StarRatingProps) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-col gap-2 my-auto">
      <Rating
        sx={{ fontSize: "3rem" }}
        value={Number(props.rating) / 2}
        precision={0.1}
        readOnly
      />
      <div className="text-base text-center flex gap-1">
        <CustomTooltip
          title={user.email === null ? "Sign in to Review" : "Write a Review"}
          arrow
        >
          <button
            className="review-button"
            onClick={() =>
              navigate("/review", { state: { mediaId: props.mediaId } })
            }
            disabled={user.email === null ? true : false}
          >
            Review
          </button>
        </CustomTooltip>
        {" | "}
        <div>{props.reviews} Reviews</div>
      </div>
    </div>
  );
}

export default StarRating;

interface StarRatingProps {
  rating: string;
  reviews: string;
  mediaId: string;
}
