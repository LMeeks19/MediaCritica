import "./WriteReviewPage.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { useRecoilState, useSetRecoilState } from "recoil";
import TopBar from "../Components/TopBar";
import { Rating, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { PostReview } from "../Server/Server";
import { ReviewModel } from "../Interfaces/ReviewModel";
import Snackbar from "../Components/Snackbar";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import Loader from "../Components/Loader";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAltOutlined";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { MediaType } from "../Enums/MediaType";

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
    if (user.id === undefined) navigate("/login");
    if (media === undefined) navigate("/")
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
      mediaSeriesTitle: (media as EpisodeModel).seriesTitle,
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
    Snackbar.Success("Review Created");
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

  function getHeaderSubTitle() {
    var episode = media as EpisodeModel;
    return `${episode.title} - S${episode.season}:E${episode.episode}`;
  }

  return (
    user.id !== undefined && (
      <div className="writereviewpage-container">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="review">
            <TopBar whiteText />
            <div className="info">
              <div className="hero">
                <div className="parent-title">
                  {(media as EpisodeModel).seriesTitle ?? media.title}
                  {media.type === MediaType.Episode && (
                    <div className="sub-title">{getHeaderSubTitle()}</div>
                  )}
                </div>
                <ToggleButtonGroup>
                  <ToggleButton
                    value="reset"
                    type="reset"
                    className="btn"
                    onClick={() => ResetFields()}
                  >
                    <RestartAltIcon />
                  </ToggleButton>
                  <ToggleButton
                    value="post"
                    className="btn"
                    form="review-form"
                    type="submit"
                    disabled={description === "" || title == ""}
                  >
                    <PostAddIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
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
                    onChange={(_event, value) => setRating(value)}
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
              />
            ) : (
              <div className="media-poster empty">
                <ImageIcon />
              </div>
            )}
          </div>
        )}
      </div>
    )
  );
}

export default WriteReviewPage;
