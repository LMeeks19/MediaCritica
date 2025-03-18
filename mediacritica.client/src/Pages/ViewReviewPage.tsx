import "./ViewReviewPage.scss";
import { Rating, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import {
  DeleteReview,
  GetCurrentUserReviewEngagement,
  GetReview,
  ToggleReviewEngagement,
  UpdateReview,
} from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { formatDistanceToNowStrict } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { UpdateReviewModel } from "../Interfaces/UpdateReviewModel";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import Loader from "../Components/Loader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import millify from "millify";
import { MediaType } from "../Enums/MediaType";
import ConfirmationDialog from "../Components/ConfirmationDialog";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [user, setUser] = useRecoilState(userState);
  const [engagement, setEngagement] = useState<number | null>(null);

  const reviewId = location.state?.reviewId;

  useEffect(() => {
    async function FetchReview() {
      reviewId === undefined && navigate("/");
      setIsLoading(true);

      const reviewData = await GetReview(reviewId);
      setReview(reviewData);

      var engagementStatus = null;
      if (user.id !== undefined)
        engagementStatus = await GetCurrentUserReviewEngagement(
          reviewId,
          user.id
        );
      setEngagement(engagementStatus);

      setTitle(reviewData.title);
      setRating(reviewData.rating);
      setDescription(reviewData.description);

      setIsLoading(false);
    }
    FetchReview();
  }, []);

  async function ToggleUserEngagement(value: number | null) {
    const newUserEngagement = await ToggleReviewEngagement(
      review.id,
      user.id,
      value
    );

    if (engagement === null && newUserEngagement === 0)
      setReview({ ...review, likes: (review.likes += 1) });
    else if (engagement === null && newUserEngagement === 1)
      setReview({ ...review, dislikes: (review.dislikes += 1) });
    else if (engagement === 0 && newUserEngagement === 1)
      setReview({
        ...review,
        likes: (review.likes -= 1),
        dislikes: (review.dislikes += 1),
      });
    else if (engagement === 1 && newUserEngagement === 0)
      setReview({
        ...review,
        likes: (review.likes += 1),
        dislikes: (review.dislikes -= 1),
      });
    else if (engagement === 0 && newUserEngagement === null)
      setReview({ ...review, likes: (review.likes -= 1) });
    else if (engagement === 1 && newUserEngagement === null)
      setReview({ ...review, dislikes: (review.dislikes -= 1) });

    setEngagement(newUserEngagement);
  }

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
  }

  async function RemoveReview() {
    await DeleteReview(review.id);
    setUser({ ...user, totalReviews: user.totalReviews - 1 });
    navigate("/account");
  }

  function ResetReviewEdit() {
    setTitle(review.title);
    setRating(review.rating);
    setDescription(review.description);
    setIsEditing(false);
  }

  const deleteReviewDialog = {
    title: "Delete review?",
    dialog: "This can't be undone!",
    cancel_text: "Cancel",
    cancel_icon: <CancelIcon />,
    confirm_text: "Delete",
    confirm_icon: <DeleteIcon />,
    confirm_action: () => RemoveReview(),
  } as ConfirmationDialogModel;

  const cancelEditReviewDialog = {
    title: "Discard unsaved changes?",
    dialog: "This will delete all edits since you last saved",
    cancel_text: "Keep Editing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Discard",
    confirm_icon: <DeleteIcon />,
    confirm_action: () => ResetReviewEdit(),
  } as ConfirmationDialogModel;

  const saveReviewDialog = {
    show: false,
    title: "Save changes?",
    dialog: "This will save all changes made to this reiew",
    cancel_text: "Keep Editing",
    cancel_icon: <EditOutlinedIcon />,
    confirm_text: "Save",
    confirm_icon: <SaveIcon />,
    confirm_action: () => PutReview(),
  } as ConfirmationDialogModel;

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] =
    useState<ConfirmationDialogModel>({} as ConfirmationDialogModel);

  return (
    <div className="viewreviewpage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="review">
          <TopBar />
          <div className="info">
            <div className="hero">
              <div className="heading">
                <div className="title">
                  <div
                    className="parent-title"
                    onClick={() =>
                      navigate(
                        `/media/${review.mediaSeriesId ?? review.mediaId}`,
                        {
                          state: {
                            mediaId: review.mediaSeriesId ?? review.mediaId,
                            mediaType: review.mediaSeriesId
                              ? MediaType.Series
                              : review.mediaType,
                          },
                        }
                      )
                    }
                  >
                    {review.mediaSeriesTitle ?? review.mediaTitle}
                  </div>
                  {review.mediaEpisode && (
                    <div
                      className="sub-title"
                      onClick={() =>
                        navigate(
                          `/media/${review.mediaSeriesId}/seasons/${review.mediaEpisode}/episodes/${review.mediaId}`,
                          {
                            state: {
                              episodeId: review.mediaId,
                            },
                          }
                        )
                      }
                    >
                      {review.mediaEpisode} - {review.mediaTitle}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {review.reviewerId === user.id &&
                    (!isEditing ? (
                      <ToggleButtonGroup>
                        <ToggleButton
                          value="edit"
                          className="btn"
                          onClick={() => setIsEditing(true)}
                        >
                          <EditOutlinedIcon />
                        </ToggleButton>
                        <ToggleButton
                          value="delete"
                          className="btn"
                          onClick={() => {
                            setConfirmationDialog(deleteReviewDialog);
                            setIsDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    ) : (
                      <ToggleButtonGroup>
                        <ToggleButton
                          value="cancel"
                          className="btn"
                          onClick={() => {
                            setConfirmationDialog(cancelEditReviewDialog);
                            setIsDialogOpen(true);
                          }}
                        >
                          <CancelIcon />
                        </ToggleButton>
                        <ToggleButton
                          value="save"
                          className="btn"
                          form="review-form"
                          type="submit"
                          disabled={
                            review.description === description &&
                            review.rating === rating &&
                            review.title === title
                          }
                        >
                          <SaveIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    ))}
                  <CustomTooltip
                    title={
                      user.id === review.reviewerId
                        ? "Cannot rate own review"
                        : user.id === undefined && "Login to rate"
                    }
                    arrow
                  >
                    <span>
                      <ToggleButtonGroup
                        value={engagement}
                        onChange={(_e, v: number) => {
                          ToggleUserEngagement(v);
                        }}
                        disabled={
                          user.id === undefined || review.reviewerId == user.id
                        }
                        exclusive
                      >
                        <ToggleButton value={0} className="btn engagement">
                          <ThumbUpIcon />
                          <div className="text">
                            {millify(review.likes, { precision: 0 })}
                          </div>
                        </ToggleButton>
                        <ToggleButton value={1} className="btn engagement">
                          <ThumbDownIcon />
                          <div className="text">
                            {millify(review.dislikes, { precision: 0 })}
                          </div>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </span>
                  </CustomTooltip>
                </div>
              </div>
              <div className="review-date">
                {CapitaliseFirstLetter(formatDistanceToNowStrict(review.date))}{" "}
                ago |{" "}
                <span
                  className="reviewer"
                  onClick={() =>
                    navigate(`/view-user/${review.reviewerName}`, {
                      state: {
                        userId: review.reviewerId,
                      },
                    })
                  }
                >
                  {review.reviewerName}
                </span>
              </div>
            </div>
            {!isEditing ? (
              <div className="review-details">
                <div className="title-section">
                  <h2>{review.title}</h2>
                  <Rating
                    value={rating}
                    precision={0.5}
                    sx={{ fontSize: "2.5rem" }}
                    readOnly
                    onChange={(_event, value) => setRating(value!)}
                  />
                </div>
                <div className="description">
                  {review.description
                    .trim()
                    .split("\n\n")
                    .map((paragraph) => {
                      return <p key={paragraph}>{paragraph}</p>;
                    })}
                </div>
              </div>
            ) : (
              <form
                id="review-form"
                className="review-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setConfirmationDialog(saveReviewDialog);
                  setIsDialogOpen(true);
                }}
              >
                <div className="title-section">
                  <input
                    className="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    name="title"
                    placeholder="Enter title..."
                    maxLength={50}
                    required
                  />
                  <Rating
                    value={rating}
                    precision={0.5}
                    sx={{ fontSize: "2.5rem" }}
                    onChange={(_event, value) => setRating(value!)}
                  />
                </div>
                <textarea
                  className="review-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  placeholder="Write review..."
                  required
                />
              </form>
            )}
          </div>
          {review.mediaPoster !== "N/A" ? (
            <div
              className="media-poster"
              style={{
                backgroundImage: `url(${review.mediaPoster.replace(
                  "300.jpg",
                  "752.jpg"
                )})`,
              }}
            ></div>
          ) : (
            <div className="media-poster empty">
              <ImageIcon />
            </div>
          )}
        </div>
      )}
      <ConfirmationDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        data={confirmationDialog}
      />
    </div>
  );
}

export default ViewReviewPage;
