import "./ReviewsPage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReviewSummaryModel } from "../Interfaces/ReviewSummaryModel";
import { GetMediaReviews } from "../Server/Server";
import { formatDistanceToNowStrict } from "date-fns";
import { Fab, Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import AddIcon from "@mui/icons-material/Add";

function ReviewsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewSummaryModel[]>(
    [] as ReviewSummaryModel[]
  );
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mediaId = location.state.mediaId;
  const mediaTitle = location.state.mediaTitle;

  useEffect(() => {
    FetchMediaReviews();
  }, []);

  async function FetchMediaReviews() {
    setIsLoading(true);
    const reviewsData = await GetMediaReviews(mediaId, reviews.length);
    setReviews([...reviews, ...reviewsData.reviews]);
    setTotalCount(reviewsData.totalCount);
    setIsLoading(false);
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
          <div
            className={`flex justify-center items-center p-6 ${
              reviews.length === totalCount && "hidden"
            }`}
          >
            <CustomTooltip title="Load more">
              <span>
                <Fab
                  disabled={reviews.length === totalCount}
                  onClick={() => FetchMediaReviews()}
                >
                  <AddIcon />
                </Fab>
              </span>
            </CustomTooltip>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
