import TopBar from "../Components/TopBar";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { GetReviews } from "../Server/Server";
import { MediaType } from "../Enums/MediaType";
import { Rating } from "@mui/material";
import "./AccountPage.scss";
import { useNavigate } from "react-router-dom";
import { ReviewsModel } from "../Interfaces/ReviewsModel";

function AccountPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<ReviewsModel>({} as ReviewsModel);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetAccount() {
      setIsLoading(true);
      const reviewsData = await GetReviews(user.email);
      setReviews(reviewsData);
      setIsLoading(false);
    }
    GetAccount();
  }, [user]);

  return (
    <>
      <TopBar hideAccount />
      <div className="accountpage-container">
        {isLoading ? (
          <div className="loader">
            <BeatLoader
              speedMultiplier={0.5}
              color="rgba(151, 18, 18, 1)"
              size={20}
            />
          </div>
        ) : user.email === null ? (
          <AccountLogin />
        ) : (
          <div className="account">
            <div className="flex flex-col w-full">
              <div className="section-heading">Account</div>
              <div className="profile">
                <div className="email">Email: {user.email}</div>
                <div className="password">Password: {user.password}</div>
              </div>
            </div>
            <div className="flex flex-wrap w-full gap-16">
              <div className="flex flex-col w-4/12 min-w-[304px] grow">
                <div className="section-heading">Movie Reviews</div>
                <div className="movie-reviews">
                  {reviews.movieReviews?.map((review) => {
                    return (
                      <div
                        key={review.mediaId}
                        className="review"
                        onClick={() =>
                          navigate(`/view-review/${review.mediaId}}`, {
                            state: { mediaId: review.mediaId },
                          })
                        }
                      >
                        <img className="poster" src={review.mediaPoster} />
                        <div className="details">
                          <div className="title">{review.mediaTitle}</div>
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col w-3/12 min-w-[304px] grow">
                <div className="section-heading">Series Reviews</div>
                <div className="series-reviews">
                  {reviews.seriesReviews?.map((review) => {
                    return (
                      <div
                        key={review.mediaId}
                        className="review"
                        onClick={() =>
                          navigate(`/view-review/${review.mediaId}}`, {
                            state: { mediaId: review.mediaId },
                          })
                        }
                      >
                        <img className="poster" src={review.mediaPoster} />
                        <div className="details">
                          <div className="title">{review.mediaTitle}</div>
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col w-4/12 min-w-[304px] grow">
                <div className="section-heading">Game Reviews</div>
                <div className="game-reviews">
                  {reviews.gameReviews?.map((review) => {
                    return (
                      <div
                        key={review.mediaId}
                        className="review"
                        onClick={() =>
                          navigate(`/view-review/${review.mediaId}}`, {
                            state: { mediaId: review.mediaId },
                          })
                        }
                      >
                        <img className="poster" src={review.mediaPoster} />
                        <div className="details">
                          <div className="title">{review.mediaTitle}</div>
                          <Rating
                            value={review.rating}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="section-heading">Episode Reviews</div>
              <div className="episode-reviews">
                {reviews.episodeReviews?.map((review) => {
                  return (
                    <div
                      key={review.mediaId}
                      className="review"
                      onClick={() =>
                        navigate(`/view-review/${review.mediaId}}`, {
                          state: { mediaId: review.mediaId },
                        })
                      }
                    >
                      <img className="poster" src={review.mediaPoster} />
                      <div className="details">
                        <div className="title">
                          {review.mediaParentTitle ?? review.mediaTitle}
                          {review.mediaType === MediaType.Episode &&
                            ` | S${review.mediaSeason}:E${review.mediaEpisode}`}
                          <div className="sub-title">
                            {review.mediaParentTitle && review.mediaTitle}
                          </div>
                        </div>
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AccountPage;
