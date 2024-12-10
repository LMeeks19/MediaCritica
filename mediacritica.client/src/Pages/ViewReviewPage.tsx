import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { DeleteReview, GetReview } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "../Enums/MediaType";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { BeatLoader } from "react-spinners";
import { formatRelative } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import "./ViewReviewPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Snackbar } from "../Components/Snackbar";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  const mediaId = location.state?.mediaId;

  useEffect(() => {
    async function FetchReview() {
      (mediaId === undefined || user.email === undefined) && navigate("/");
      setIsLoading(true);
      const reviewData = await GetReview(mediaId, user.email);
      console.log(review.date);
      setReview(reviewData);
      setIsLoading(false);
    }
    FetchReview();
  }, []);

  async function RemoveReview() {
    await DeleteReview(review.id);
    Snackbar("Review Deleted", "success");
    history.back();
  }

  return (
    <>
      <TopBar />
      <div className="viewreviewpage-container">
        {isLoading ? (
          <div className="review empty">
            <div className="loader">
              <BeatLoader
                speedMultiplier={0.5}
                color="rgba(151, 18, 18, 1)"
                size={20}
              />
            </div>
          </div>
        ) : (
          <div className="review">
            <div className="media-details">
              <div className="info">
                <img className="media-poster" src={review.mediaPoster} />
                <div className="parent-title">
                  {review.mediaParentTitle ?? review.mediaTitle}
                  {review.mediaType === MediaType.Episode &&
                    ` | S${review.mediaSeason}:E${review.mediaEpisode}`}
                  <div className="sub-title">
                    {review.mediaParentTitle && review.mediaTitle}
                  </div>
                </div>
                <div className="flex gap-3">
                  <FontAwesomeIcon className="action-icon edit" icon={faEdit} />
                  <FontAwesomeIcon
                    onClick={() => RemoveReview()}
                    className="action-icon delete"
                    icon={faTrashCan}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center items-center">
                <Rating
                  value={review.rating}
                  precision={0.5}
                  sx={{ fontSize: "4rem" }}
                  readOnly
                />
                Reviewed:{" "}
                {CapitaliseFirstLetter(formatRelative(review.date, new Date()))}
              </div>
            </div>
            <div className="review-details">
              <div>
                {review.description.split("\\n").map((str) => {
                  return (
                    <>
                      <br /> {str}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewReviewPage;
