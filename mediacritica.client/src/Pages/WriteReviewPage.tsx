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
import "./WriteReviewPage.scss";
import { Snackbar } from "../Components/Snackbar";

function WriteReviewPage() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);

  const media = location.state?.media as
    | MovieModel
    | SeriesModel
    | EpisodeModel;
  const parent = location.state?.parent as SeriesModel;

  useEffect(() => {
    (media === undefined || user.email === null) && navigate("/");
  });

  async function submitReview(e: FormEvent) {
    e.preventDefault();

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
    } as ReviewModel;

    await PostReview(review);
    Snackbar("Review Created", "success");
    navigate("/")
  }

  return (
    <div className="writereviewpage-container">
      <TopBar />
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
              <div className="sub-title">{parent?.Title && media.Title}</div>
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
            onChange={(e) => setDescription(e.target.value)}
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
    </div>
  );
}

export default WriteReviewPage;
