import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { FormEvent, useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { DeleteReview, GetReview, UpdateReview } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "../Enums/MediaType";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { BeatLoader } from "react-spinners";
import { formatRelative } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import "./ViewReviewPage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Snackbar } from "../Components/Snackbar";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  const mediaId = location.state?.mediaId;

  useEffect(() => {
    async function FetchReview() {
      (mediaId === undefined || user.id === undefined) && navigate("/");
      setIsLoading(true);
      const reviewData = await GetReview(mediaId, user.id);
      setReview(reviewData);

      setRating(reviewData.rating);
      setDescription(reviewData.description);
      setIsLoading(false);
    }
    FetchReview();
  }, []);

  async function PutReview(event: FormEvent) {
    event.preventDefault();
    const details = {
      reviewId: review.id,
      description: description,
      rating: rating,
      date: new Date(),
    } as UpdateReviewModel;

    const updatedReview = await UpdateReview(details);
    setReview(updatedReview);
    setIsEditing(false);
    Snackbar("Review Updated", "success");
  }

  async function RemoveReview() {
    await DeleteReview(review.id);
    Snackbar("Review Deleted", "success");
    history.back();
  }

  function ResetReviewEdit() {
    setRating(review.rating);
    setDescription(review.description);
    setIsEditing(false);
  }

  const deleteReviewDialog = {
    show: true,
    title: "Delete review",
    dialog: "This can't be undone",
    cancel_text: "Cancel",
    confirm_text: "Delete",
    confirm_action: () => RemoveReview(),
  } as unknown as ConfirmationDialogModel;

  const cancelEditReviewDialog = {
    show: true,
    title: "Discard unsaved changes",
    dialog: "This will delete all edits since you last saved",
    cancel_text: "Keep Editing",
    confirm_text: "Discard",
    confirm_action: () => ResetReviewEdit(),
  } as unknown as ConfirmationDialogModel;

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
                  {!isEditing ? (
                    <FontAwesomeIcon
                      className="action-icon edit"
                      icon={faEdit}
                      onClick={() => setIsEditing(true)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="action-icon edit"
                      icon={faCancel}
                      onClick={() => setConfirmationDialog(cancelEditReviewDialog)}
                    />
                  )}
                  <FontAwesomeIcon
                    onClick={() => setConfirmationDialog(deleteReviewDialog)}
                    className="action-icon delete"
                    icon={faTrashCan}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 justify-center items-center">
                <Rating
                  value={rating}
                  precision={0.5}
                  sx={{ fontSize: "4rem" }}
                  readOnly={isEditing ? false : true}
                  onChange={(_event, value) => setRating(value!)}
                />
                Reviewed:{" "}
                {CapitaliseFirstLetter(formatRelative(review.date, new Date()))}
              </div>
            </div>
            {!isEditing ? (
              <div className="review-details">
                {review.description.split("\\n").map((str) => {
                  return (
                    <div key={str}>
                      <br /> {str}
                    </div>
                  );
                })}
              </div>
            ) : (
              <form className="review-form" onSubmit={(e) => PutReview(e)}>
                <textarea
                  className="review-description"
                  value={description}
                  name="description"
                  placeholder="Add review..."
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="review-buttons">
                  <button
                    type="reset"
                    className="reset-btn"
                    onClick={() => {
                      setRating(review.rating);
                      setDescription(review.description);
                    }}
                  >
                    Reset
                  </button>
                  <button className="save-btn" type="submit">
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ViewReviewPage;
