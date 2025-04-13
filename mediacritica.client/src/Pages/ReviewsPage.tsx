import "./ReviewsPage.scss";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const [reviewsObject, setReviewsObject] = useState<{
    title: string;
    reviews: ReviewSummaryModel[];
    totalCount: number;
  }>({ title: "", reviews: [], totalCount: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { mediaId } = useParams();

  useEffect(() => {
    FetchMediaReviews();
  }, []);

  async function FetchMediaReviews() {
    setIsLoading(true);
    const reviewsData = await GetMediaReviews(
      mediaId!,
      reviewsObject.reviews.length
    );
    setReviewsObject(reviewsData);
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
            <h1>{reviewsObject.title} Reviews</h1>
          </div>
          <div className="review-cards">
            {reviewsObject.reviews.map((review) => {
              return (
                <div
                  className="review-card"
                  key={review.id}
                  onClick={() =>
                    navigate(
                      `/${review.mediaType}/${mediaId}/reviews/${review.id}`
                    )
                  }
                >
                  <h3>{review.title}</h3>
                  <div className="flex justify-evenly gap-2 flex-wrap">
                    <Rating value={review.rating} precision={0.5} readOnly />
                    <p>{formatDistanceToNowStrict(review.date)} ago </p>
                    <p>{review.reviewerUsername}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`flex justify-center items-center p-6 ${
              reviewsObject.reviews.length === reviewsObject.totalCount &&
              "hidden"
            }`}
          >
            <CustomTooltip title="Load more">
              <span>
                <Fab
                  disabled={
                    reviewsObject.reviews.length === reviewsObject.totalCount
                  }
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
