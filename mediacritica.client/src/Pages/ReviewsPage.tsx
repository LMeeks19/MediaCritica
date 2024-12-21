import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReviewSummaryModel } from "../Interfaces/ReviewSummaryModel";
import { Get40MediaReviews } from "../Server/Server";
import { formatDistanceToNowStrict } from "date-fns";
import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import "./ReviewsPage.scss";

function ReviewsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewSummaryModel[]>(
    [] as ReviewSummaryModel[]
  );
  const [isLoadDisabled, setIsLoadDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mediaId = location.state.mediaId;
  const mediaTitle = location.state.mediaTitle;

  useEffect(() => {
    setIsLoading(true);
    FetchMediaReviews();
    setIsLoading(false);
  }, []);

  async function FetchMediaReviews() {
    const reviewsData = await Get40MediaReviews(mediaId, reviews.length);
    if (reviewsData.length === 40) setIsLoadDisabled(false);
    setReviews([...reviews, ...reviewsData]);
  }

  return (
    <div className="reviewspage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="reviews">
          <TopBar />
          <div className="header">
            <h1>{mediaTitle} Reviews</h1>
          </div>
          <div className="review-cards">
            {reviews.map((review) => {
              return (
                <div
                  className="review-card"
                  key={review.id}
                  onClick={() =>
                    navigate(`/media/${mediaId}/view-review/${review.id}`, {
                      state: { reviewId: review.id },
                    })
                  }
                >
                  <h3>{review.title}</h3>
                  <div className="flex justify-evenly gap-2 flex-wrap">
                    <Rating value={review.rating} precision={0.5} readOnly />
                    <p>{formatDistanceToNowStrict(review.date)} ago </p>
                    <p>{review.reviewerName}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="button-container">
            <CustomTooltip title={isLoadDisabled && "All reviews loaded"} arrow>
              <span>
                <button
                  className="load-btn"
                  disabled={isLoadDisabled}
                  onClick={() => FetchMediaReviews()}
                >
                  Load More <FontAwesomeIcon icon={faSpinner} />
                </button>
              </span>
            </CustomTooltip>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
