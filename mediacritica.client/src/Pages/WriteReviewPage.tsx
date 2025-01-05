import "./WriteReviewPage.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { useRecoilState, useSetRecoilState } from "recoil";
import TopBar from "../Components/TopBar";
import { Rating } from "@mui/material";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { PostReview } from "../Server/Server";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { Snackbar } from "../Components/Snackbar";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import Loader from "../Components/Loader";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAltOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";

function WriteReviewPage() {
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  const media = location.state?.media as
    | MovieModel
    | SeriesModel
    | EpisodeModel;

  useEffect(() => {
    (media === undefined || user.id === undefined) && navigate("/");
    setIsLoading(false);
  });

  const postReviewDialog = {
    show: true,
    title: "Post review",
    dialog: "This will post everything written in this review",
    cancel_text: "Keep Writing",
    confirm_text: "Post",
    confirm_action: null,
  } as unknown as ConfirmationDialogModel;

  async function SubmitReview() {
    setIsLoading(true);
    const review = {
      mediaId: media.id,
      mediaPoster: media.poster,
      mediaTitle: media.title,
      mediaType: media.type,
      reviewerId: user.id,
      reviewerName: `${user.forename} ${user.surname}`,
      title: title,
      rating: rating,
      description: description,
      date: new Date(),
    } as ReviewModel;

    const reviewId = await PostReview(review);
    setUser({ ...user, totalReviews: user.totalReviews + 1 });
    Snackbar("Review Created", "success");
    navigate(`/media/${media.id}/view-review/${reviewId}`, {
      state: { reviewId: reviewId },
    });
    setIsLoading(false);
  }

  function ResetFields() {
    setTitle("");
    setDescription("");
    setRating(0);
  }

  return (
    <div className="writereviewpage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="review">
          <TopBar whiteText />
          <div className="info">
            <div className="hero">
              <div className="parent-title">{media.title}</div>
              <div className="flex flex-col justify-center items-center gap-2">
                <Rating
                  value={rating}
                  precision={0.5}
                  sx={{ fontSize: "3rem" }}
                  onChange={(_event, value) => setRating(value)}
                />
                <div className="flex gap-3 pt-2">
                  <button
                    type="reset"
                    className="reset-btn"
                    onClick={() => ResetFields()}
                  >
                    Reset
                    <RestartAltIcon fontSize="small" />
                  </button>
                  <button
                    className="post-btn"
                    form="review-form"
                    type="submit"
                    disabled={description === "" || title == ""}
                  >
                    Post
                    <PostAddIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
            <form
              id="review-form"
              className="review-form"
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmationDialog({
                  ...postReviewDialog,
                  confirm_action: () => SubmitReview(),
                });
              }}
            >
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
              <textarea
                className="review-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                placeholder="Write review..."
                required
              />
            </form>
          </div>
          {media.poster !== "N/A" ? (
            <div
              className="media-poster"
              style={{
                backgroundImage: `url(${media.poster.replace(
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
    </div>
  );
}

export default WriteReviewPage;
