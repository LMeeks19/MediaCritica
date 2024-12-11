import TopBar from "../Components/TopBar";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { FormEvent, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { GetReviews, UpdateUser } from "../Server/Server";
import { MediaType } from "../Enums/MediaType";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReviewsModel } from "../Interfaces/ReviewsModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import {
  AccountEditModel,
  AccountFieldValue,
} from "../Interfaces/AccountModels";
import "./AccountPage.scss";
import { AccountFieldType } from "../Enums/AccountFieldType";
import { Snackbar } from "../Components/Snackbar";

function AccountPage() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<ReviewsModel>({} as ReviewsModel);
  const [accountEditState, setAccountEditState] = useState<AccountEditModel>({
    isEditing: false,
    fieldType: null,
  } as AccountEditModel);
  const navigate = useNavigate();
  const [fieldValue, setFieldValue] = useState<AccountFieldValue>({
    email: "",
    value: "",
    type: null,
  } as AccountFieldValue);

  useEffect(() => {
    async function GetAccount() {
      setIsLoading(true);
      const reviewsData = await GetReviews(user.email);
      setReviews(reviewsData);
      setIsLoading(false);
    }
    GetAccount();
  }, [user]);

  function ResetAccountField() {
    setFieldValue({ email: user.email, value: "", type: null });
    setAccountEditState({
      isEditing: false,
      fieldType: null,
    });
  }

  async function UpdateAccountField(event: FormEvent) {
    event.preventDefault();
    const userData = await UpdateUser(fieldValue);
    setUser(userData);
    Snackbar("Account Updated", "success");
    ResetAccountField();
  }

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
              <div className="section-heading account">Account</div>
              <div className="profile">
                <div className="field">
                  <div className="key w-2/5">Email</div>
                  {accountEditState.isEditing &&
                  accountEditState.fieldType === AccountFieldType.Email ? (
                    <form
                      id="email-form"
                      className="value w-2/5"
                      onSubmit={(e) => UpdateAccountField(e)}
                    >
                      <input
                        className="input"
                        type="email"
                        placeholder="Enter new email..."
                        autoComplete="off"
                        value={fieldValue.value}
                        onChange={(e) =>
                          setFieldValue({
                            email: user.email,
                            value: e.target.value,
                            type: AccountFieldType.Email,
                          })
                        }
                        required
                      />
                    </form>
                  ) : (
                    <div className="value w-2/5">{user.email}</div>
                  )}
                  <div className="action w-1/5">
                    {accountEditState.fieldType !== AccountFieldType.Email && (
                      <FontAwesomeIcon
                        className={`icon ${
                          accountEditState.isEditing && "disabled"
                        }`}
                        icon={faEdit}
                        onClick={() =>
                          setAccountEditState({
                            isEditing: true,
                            fieldType: AccountFieldType.Email,
                          })
                        }
                      />
                    )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType === AccountFieldType.Email && (
                        <FontAwesomeIcon
                          className="icon"
                          icon={faCancel}
                          onClick={() => ResetAccountField()}
                        />
                      )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType === AccountFieldType.Email && (
                        <button type="submit" form="email-form">
                          <FontAwesomeIcon className="icon" icon={faSave} />
                        </button>
                      )}
                  </div>
                </div>
                <div className="field">
                  <div className="key w-2/5">Password</div>
                  {accountEditState.fieldType === AccountFieldType.Password ? (
                    <form
                      id="password-form"
                      className="value w-2/5"
                      onSubmit={(e) => UpdateAccountField(e)}
                    >
                      <input
                        className="input"
                        type="password"
                        placeholder="Enter new password..."
                        autoComplete="off"
                        value={fieldValue.value}
                        onChange={(e) =>
                          setFieldValue({
                            email: user.email,
                            value: e.target.value,
                            type: AccountFieldType.Password,
                          })
                        }
                        required
                      />
                    </form>
                  ) : (
                    <div className="value w-2/5">{user.password}</div>
                  )}
                  <div className="action w-1/5">
                    {accountEditState.fieldType !==
                      AccountFieldType.Password && (
                      <FontAwesomeIcon
                        className={`icon ${
                          accountEditState.isEditing && "disabled"
                        }`}
                        icon={faEdit}
                        onClick={() =>
                          setAccountEditState({
                            isEditing: true,
                            fieldType: AccountFieldType.Password,
                          })
                        }
                      />
                    )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType ===
                        AccountFieldType.Password && (
                        <FontAwesomeIcon
                          className="icon"
                          icon={faCancel}
                          onClick={() => ResetAccountField()}
                        />
                      )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType ===
                        AccountFieldType.Password && (
                        <button type="submit" form="password-form">
                          <FontAwesomeIcon className="icon" icon={faSave} />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap w-full gap-6">
              <div className="flex flex-col grow overflow-x-auto">
                <div className="section-heading">Movie Reviews</div>
                {reviews.movieReviews?.length === 0 ? (
                  <div className="movie-reviews empty">No Movies Reviewed</div>
                ) : (
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
                )}
              </div>
              <div className="flex flex-col grow overflow-x-auto">
                <div className="section-heading">Series Reviews</div>
                {reviews.seriesReviews?.length === 0 ? (
                  <div className="series-reviews empty">No Series Reviewed</div>
                ) : (
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
                )}
              </div>
              <div className="flex flex-col grow overflow-x-auto">
                <div className="section-heading">Game Reviews</div>
                {reviews.gameReviews?.length === 0 ? (
                  <div className="game-reviews empty">No Games Reviewed</div>
                ) : (
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
                )}
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="section-heading">Episode Reviews</div>
              {reviews.episodeReviews?.length === 0 ? (
                <div className="episode-reviews empty">No Episodes Reviewed</div>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AccountPage;
