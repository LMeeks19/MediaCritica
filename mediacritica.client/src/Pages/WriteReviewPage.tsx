import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userState } from "../State/GlobalState";
import { useRecoilValue } from "recoil";
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
import "./WriteReviewPage.scss";

function WriteReviewPage() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const media = location.state?.media as
    | MovieModel
    | SeriesModel
    | EpisodeModel;
  const parent = location.state?.parent as SeriesModel;

  useEffect(() => {
    (media === undefined || user.email === null) && navigate("/");
    setIsLoading(false)
  });

  async function submitReview(e: FormEvent) {
    e.preventDefault();

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
      reviewerEmail: user.email,
      rating: rating,
      description: description,
      date: new Date(),
    } as ReviewModel;

    await PostReview(review);
    Snackbar("Review Created", "success");
    navigate("/");

    setIsLoading(false);
  }

  return (
    <>
      <TopBar />
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
            <div className="media-details">
              <div className="info">
                <img className="media-poster" src={media.Poster} />
                <div className="parent-title">
                  {parent?.Title ?? media.Title}
                  {media.Type === MediaType.Episode &&
                    ` | S${(media as EpisodeModel).Season}:E${
                      (media as EpisodeModel).Episode
                    }`}
                  <div className="sub-title">
                    {parent?.Title && media.Title}
                  </div>
                </div>
              </div>
              <Rating
                value={rating}
                precision={0.5}
                sx={{ fontSize: "4rem" }}
                onChange={(_event, value) => setRating(value)}
              />
            </div>
            <form className="review-form" onSubmit={(e) => submitReview(e)}>
              <textarea
                className="review-description"
                value={description}
                onChange={(e) => setDescription(e.target.value.split('\n').join("\\n"))}
                name="description"
                placeholder="Add review..."
                required
              />
              <div className="review-buttons">
                <button
                  type="reset"
                  className="reset-button"
                  onClick={() => {
                    setDescription(""), setRating(0);
                  }}
                >
                  Reset
                </button>
                <button className="submit-button" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default WriteReviewPage;
