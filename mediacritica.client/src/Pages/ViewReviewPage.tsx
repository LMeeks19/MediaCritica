import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { DeleteReview, GetReview, UpdateReview } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "../Enums/MediaType";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { BeatLoader } from "react-spinners";
import { formatRelative } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faFloppyDisk,
  faRotate,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Snackbar } from "../Components/Snackbar";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import "./ViewReviewPage.scss";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);
  const [user, setUser] = useRecoilState(userState);

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

  async function PutReview() {
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
    setUser({ ...user, totalReviews: user.totalReviews- 1 });
    Snackbar("Review Deleted", "success");
    navigate("/account");
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

  const saveReviewDialog = {
    show: true,
    title: "Save changes",
    dialog: "This will save all changes made to this reiew",
    cancel_text: "Keep Editing",
    confirm_text: "Save",
    confirm_action: null,
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
              </div>
              <div className="flex flex-col gap-3 justify-center items-center">
                <Rating
                  value={rating}
                  precision={0.5}
                  sx={{ fontSize: "4rem" }}
                  readOnly={isEditing ? false : true}
                  onChange={(_event, value) => setRating(value!)}
                />
                <div>
                  Reviewed:{" "}
                  {CapitaliseFirstLetter(
                    formatRelative(review.date, new Date())
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  {!isEditing ? (
                    <button
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                      <FontAwesomeIcon className="icon" icon={faEdit} />
                    </button>
                  ) : (
                    <button
                      className="cancel-btn"
                      onClick={() =>
                        setConfirmationDialog(cancelEditReviewDialog)
                      }
                    >
                      Cancel
                      <FontAwesomeIcon className="icon" icon={faCancel} />
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => setConfirmationDialog(deleteReviewDialog)}
                    disabled={isEditing}
                  >
                    Delete
                    <FontAwesomeIcon className="icon" icon={faTrashCan} />
                  </button>
                </div>
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
              <form
                className="review-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setConfirmationDialog({
                    ...saveReviewDialog,
                    confirm_action: () => PutReview(),
                  });
                }}
              >
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
                    disabled={
                      review.description === description &&
                      review.rating === rating
                    }
                  >
                    Reset
                    <FontAwesomeIcon icon={faRotate} flip="horizontal" />
                  </button>
                  <button
                    className="save-btn"
                    type="submit"
                    disabled={
                      review.description === description &&
                      review.rating === rating
                    }
                  >
                    Save
                    <FontAwesomeIcon icon={faFloppyDisk} />
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
