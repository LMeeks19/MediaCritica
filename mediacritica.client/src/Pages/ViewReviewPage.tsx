import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { GetReview } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "../Enums/MediaType";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { BeatLoader } from "react-spinners";
import "./ViewReviewPage.scss";

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
              </div>
              <Rating
                value={review.rating}
                precision={0.5}
                sx={{ fontSize: "4rem" }}
                readOnly
              />
            </div>
            <div className="review-details">{review.description}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default ViewReviewPage;
