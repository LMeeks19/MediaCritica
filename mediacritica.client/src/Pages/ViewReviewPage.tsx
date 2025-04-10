import "./ViewReviewPage.scss";
import {
  Button,
  ButtonGroup,
  Rating,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TopBar from "../Components/TopBar";
import { useEffect, useRef, useState } from "react";
import { ReviewModel } from "../Interfaces/ReviewModel";
import {
  DeleteReview,
  GetCurrentUserReviewEngagement,
  GetReview,
  ToggleReviewEngagement,
  UpdateReview,
} from "../Server/Server";
import { useNavigate, useParams } from "react-router-dom";
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
import CommentIcon from "@mui/icons-material/CommentOutlined";
import ShareIcon from "@mui/icons-material/ShareOutlined";
import { CustomTooltip } from "../Components/Tooltip";
import millify from "millify";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import CommentsDialog from "../Components/CommentsDialog";
import { ShareDialog } from "../Components/ShareDialog";
import FlagIcon from "@mui/icons-material/FlagOutlined";
import ReportDialog from "../Components/ReportDialog";

function ViewReviewPage() {
  const [review, setReview] = useState<ReviewModel>({} as ReviewModel);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [user, setUser] = useRecoilState(userState);
  const [engagement, setEngagement] = useState<number>(-1);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const quillRef = useRef<ReactQuill>(null);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [isReporting, setIsReporting] = useState<boolean>(false);

  useEffect(() => {
    async function FetchReview() {
      try {
        Number(reviewId!);
      } catch {
        navigate("/");
      }
      setIsLoading(true);
      const reviewData = await GetReview(Number(reviewId!));
      setReview(reviewData);

      if (user.id !== undefined && user.id !== reviewData.reviewerId) {
        var engagementStatus = await GetCurrentUserReviewEngagement(
          Number(reviewId!)
        );
        setEngagement(engagementStatus);
      }

      setTitle(reviewData.title);
      setRating(reviewData.rating);
      setDescription(reviewData.description);

      setIsLoading(false);
    }
    FetchReview();
  }, []);

  async function ToggleUserEngagement(value: number | null) {
    const newUserEngagement = await ToggleReviewEngagement(review.id, value);

    if (engagement === -1 && newUserEngagement === 0)
      setReview({ ...review, likes: (review.likes += 1) });
    else if (engagement === -1 && newUserEngagement === 1)
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
    else if (engagement === 0 && newUserEngagement === -1)
      setReview({ ...review, likes: (review.likes -= 1) });
    else if (engagement === 1 && newUserEngagement === -1)
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

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: ["", "center", "right", "justify"] }],
      ["link"],
    ],
  };

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
                        `/${review.mediaType}/${
                          review.mediaSeriesId ?? review.mediaId
                        }`
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
                          `/${review.mediaType}/${review.mediaSeriesId}/seasons/${review.mediaEpisode}/episodes/${review.mediaId}`
                        )
                      }
                    >
                      {review.mediaEpisode} - {review.mediaTitle}
                    </div>
                  )}
                </div>
                <div className="review-date">
                  {CapitaliseFirstLetter(
                    formatDistanceToNowStrict(review.date)
                  )}{" "}
                  ago |{" "}
                  <span
                    className="reviewer"
                    onClick={() =>
                      navigate(`/view-user/${review.reviewerUsername}`)
                    }
                  >
                    {review.reviewerUsername}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <ButtonGroup>
                  <Button onClick={() => setCommentsOpen(true)}>
                    <CustomTooltip title={`Comments (${review.totalComments})`}>
                      <CommentIcon />
                    </CustomTooltip>
                  </Button>
                  <Button onClick={() => setShareOpen(true)}>
                    <CustomTooltip title="Share">
                      <ShareIcon />
                    </CustomTooltip>
                  </Button>
                  {user.id === review.reviewerId && !isEditing && (
                    <Button value="edit" onClick={() => setIsEditing(true)}>
                      <CustomTooltip title="Edit">
                        <EditOutlinedIcon />
                      </CustomTooltip>
                    </Button>
                  )}
                  {user.id === review.reviewerId && isEditing && (
                    <Button
                      value="cancel"
                      onClick={() => {
                        setConfirmationDialog(cancelEditReviewDialog);
                        setIsDialogOpen(true);
                      }}
                    >
                      <CustomTooltip title="Cancel">
                        <CancelIcon />
                      </CustomTooltip>
                    </Button>
                  )}
                  {user.id === review.reviewerId && !isEditing && (
                    <Button
                      value="delete"
                      onClick={() => {
                        setConfirmationDialog(deleteReviewDialog);
                        setIsDialogOpen(true);
                      }}
                    >
                      <CustomTooltip title="Delete">
                        <DeleteIcon />
                      </CustomTooltip>
                    </Button>
                  )}
                  {user.id === review.reviewerId && isEditing && (
                    <Button
                      value="save"
                      form="review-form"
                      type="submit"
                      disabled={
                        review.description === description &&
                        review.rating === rating &&
                        review.title === title
                      }
                    >
                      <CustomTooltip title="Save">
                        <SaveIcon />
                      </CustomTooltip>
                    </Button>
                  )}
                  {user.id !== review.reviewerId && user.id !== undefined && (
                    <CustomTooltip title="Report">
                      <Button onClick={() => setIsReporting(true)}>
                        <FlagIcon className="icon" />
                      </Button>
                    </CustomTooltip>
                  )}
                </ButtonGroup>
                {user.id !== review.reviewerId && user.id !== undefined && (
                  <ToggleButtonGroup
                    onChange={(_e, v) => ToggleUserEngagement(v)}
                    value={engagement}
                    exclusive
                  >
                    <CustomTooltip
                      title={`Like (${millify(review.likes, {
                        precision: 0,
                      })})`}
                    >
                      <ToggleButton className="engagement-button" value={0}>
                        <ThumbUpIcon />
                      </ToggleButton>
                    </CustomTooltip>
                    <CustomTooltip
                      title={`Dislike (${millify(review.dislikes, {
                        precision: 0,
                      })})`}
                    >
                      <ToggleButton className="engagement-button" value={1}>
                        <ThumbDownIcon />
                      </ToggleButton>
                    </CustomTooltip>
                  </ToggleButtonGroup>
                )}
              </div>
            </div>
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
                  readOnly={!isEditing}
                />
                <Rating
                  value={rating}
                  precision={0.5}
                  sx={{ fontSize: "2.5rem" }}
                  onChange={(_event, value) => setRating(value!)}
                />
              </div>
              <div className="flex flex-col w-full h-full overflow-hidden">
                <ReactQuill
                  ref={quillRef}
                  className={`review-description ${!isEditing && "readonly"}`}
                  placeholder="Enter review..."
                  value={JSON.parse(description) as DeltaStatic}
                  onChange={(_v, _d, _s, editor) => {
                    const textLength = editor.getLength() - 1;
                    const quill = quillRef.current?.getEditor();
                    if (textLength <= 2000) {
                      setDescription(JSON.stringify(editor.getContents()));
                      setCharacterCount(textLength);
                    } else if (quill) {
                      quill.deleteText(2000, textLength - 2000); // Remove extra characters
                    }
                  }}
                  readOnly={!isEditing}
                  modules={modules}
                />
                {isEditing && (
                  <div className="character-count">{characterCount}/2000</div>
                )}
              </div>
            </form>
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
      <CommentsDialog
        open={commentsOpen}
        setOpen={setCommentsOpen}
        reviewId={review.id}
      />
      <ShareDialog open={shareOpen} setOpen={setShareOpen} review={review} />
      <ReportDialog
        open={isReporting}
        setOpen={setIsReporting}
        reviewId={review.id}
      />
    </div>
  );
}

export default ViewReviewPage;
