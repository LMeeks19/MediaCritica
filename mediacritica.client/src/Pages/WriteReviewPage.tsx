import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import { useRecoilState, useSetRecoilState } from "recoil";
import TopBar from "../Components/TopBar";
import { Rating } from "@mui/material";
import { MovieModel } from "../Interfaces/MovieModel";
import { SeriesModel } from "../Interfaces/SeriesModel";
import { EpisodeModel } from "../Interfaces/EpisodeModel";
import { MediaType } from "../Enums/MediaType";
import { PostReview } from "../Server/Server";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { Snackbar } from "../Components/Snackbar";
import { BeatLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faRotate, faShare } from "@fortawesome/free-solid-svg-icons";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import "./WriteReviewPage.scss";

function WriteReviewPage() {
  const [user, setUser] = useRecoilState(userState);
  const location = useLocation();
  const navigate = useNavigate();
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  const media = location.state?.media as
    | MovieModel
    | SeriesModel
    | EpisodeModel;
  const parent = location.state?.parent as SeriesModel;

  useEffect(() => {
    (media === undefined || user.id === null) && navigate("/");
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
      mediaId: media.imdbID,
      mediaPoster: media.Poster,
      mediaTitle: media.Title,
      mediaType: media.Type,
      mediaSeason:
        media.Type === MediaType.Episode
          ? Number((media as EpisodeModel).Season)
          : null,
      mediaEpisode:
        media.Type === MediaType.Episode
          ? Number((media as EpisodeModel).Episode)
          : null,
      mediaParentId: parent?.imdbID,
      mediaParentTitle: parent?.Title,
      reviewerId: user.id,
      rating: rating,
      description: description,
      date: new Date(),
    } as ReviewModel;

    const reviewId = await PostReview(review);
    setUser({ ...user, totalReviews: user.totalReviews + 1 });
    Snackbar("Review Created", "success");
    navigate(`/view-review/${reviewId}`, {
      state: { reviewId: reviewId },
    });
    setIsLoading(false);
  }

  return (
    <div className="writereviewpage-container">
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
          <div className="info">
            <TopBar topbarColor="rgba(151, 18, 18, 1)" />
            <div className="hero">
              <div className="parent-title">
                {parent?.Title ?? media.Title}
                {media.Type === MediaType.Episode &&
                  ` | S${(media as EpisodeModel).Season}:E${
                    (media as EpisodeModel).Episode
                  }`}
                <div className="sub-title">{parent?.Title && media.Title}</div>
              </div>
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
                    onClick={() => {
                      setDescription(""), setRating(0);
                    }}
                  >
                    Reset
                    <FontAwesomeIcon icon={faRotate} flip="horizontal" />
                  </button>
                  <button
                    className="post-btn"
                    form="review-form"
                    type="submit"
                    disabled={description === ""}
                  >
                    Post
                    <FontAwesomeIcon icon={faShare} />
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
          {media.Poster !== "N/A" ? (
            <div
              className="media-poster"
              style={{ backgroundImage: `url(${media.Poster})` }}
            ></div>
          ) : (
            <div className="media-poster empty">
              <FontAwesomeIcon icon={faImage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WriteReviewPage;
