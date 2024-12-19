import { Rating } from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { DeleteReview, GetReview, UpdateReview } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { MediaType } from "../Enums/MediaType";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { formatRelative } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faFloppyDisk,
  faImage,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Snackbar } from "../Components/Snackbar";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import Loader from "../Components/Loader";
import "./ViewReviewPage.scss";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);
  const [user, setUser] = useRecoilState(userState);

  const reviewId = location.state?.reviewId;

  useEffect(() => {
    async function FetchReview() {
      reviewId === undefined && navigate("/");
      setIsLoading(true);
      const reviewData = await GetReview(reviewId);
      setReview(reviewData);

      setTitle(reviewData.title);
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
      title: title,
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
    setUser({ ...user, totalReviews: user.totalReviews - 1 });
    Snackbar("Review Deleted", "success");
    navigate("/account");
  }

  function ResetReviewEdit() {
    setTitle(review.title);
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
      <div className="viewreviewpage-container">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="review">
            <div className="info">
              <TopBar topbarColor="rgba(151, 18, 18, 1)" />
              <div className="hero">
                <div className="parent-title">
                  {review.mediaParentTitle ?? review.mediaTitle}
                  {review.mediaType === MediaType.Episode &&
                    ` | S${review.mediaSeason}:E${review.mediaEpisode}`}
                  <div className="sub-title">
                    {review.mediaParentTitle && review.mediaTitle}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <Rating
                    value={rating}
                    precision={0.5}
                    sx={{ fontSize: "2.5rem" }}
                    readOnly={!isEditing}
                    onChange={(_event, value) => setRating(value!)}
                  />
                  <div className="review-date">
                    {CapitaliseFirstLetter(
                      formatRelative(review.date, new Date())
                    )}{" "}
                    | {review.reviewerName}
                  </div>
                  {review.reviewerId === user.id && (
                    <div className="flex gap-3 pt-2">
                      {!isEditing ? (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              setConfirmationDialog(deleteReviewDialog)
                            }
                            disabled={isEditing}
                          >
                            Delete
                            <FontAwesomeIcon
                              className="icon"
                              icon={faTrashCan}
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              setConfirmationDialog(cancelEditReviewDialog)
                            }
                          >
                            Cancel
                            <FontAwesomeIcon className="icon" icon={faCancel} />
                          </button>
                          <button
                            className="save-btn"
                            form="review-form"
                            type="submit"
                            disabled={
                              review.description === description &&
                              review.rating === rating &&
                              review.title === title
                            }
                          >
                            Save
                            <FontAwesomeIcon icon={faFloppyDisk} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {!isEditing ? (
                <div className="review-details">
                  <h2>{review.title}</h2>
                  {review.description
                    .trim()
                    .split("\n\n")
                    .map((paragraph) => {
                      return <p key={paragraph}>{paragraph}</p>;
                    })}
                </div>
              ) : (
                <form
                  id="review-form"
                  className="review-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setConfirmationDialog({
                      ...saveReviewDialog,
                      confirm_action: () => PutReview(),
                    });
                  }}
                >
                  <input
                    className="review-title"
                    type="text"
                    value={title}
                    name="title"
                    placeholder="Enter title..."
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    className="review-description"
                    value={description}
                    name="description"
                    placeholder="Write review..."
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </form>
              )}
            </div>
            {review.mediaPoster !== "N/A" ? (
              <div
                className="media-poster"
                style={{ backgroundImage: `url(${review.mediaPoster})` }}
              ></div>
            ) : (
              <div className="media-poster empty">
                <FontAwesomeIcon icon={faImage} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ViewReviewPage;
