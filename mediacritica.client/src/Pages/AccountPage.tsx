import TopBar from "../Components/TopBar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ConfirmationDialogState, userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { useEffect, useState } from "react";
import { GetBacklog, GetReviews, UpdateUser } from "../Server/Server";
import { AppBar, MenuItem, Rating, Select, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEdit,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  AccountEditModel,
  AccountFieldValue,
} from "../Interfaces/AccountModels";
import { AccountFieldType } from "../Enums/AccountFieldType";
import { Snackbar } from "../Components/Snackbar";
import { ReviewModel } from "../Interfaces/ReviewModel";
import "./AccountPage.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { ConfirmationDialogModel } from "../Interfaces/ConfirmationDialogModel";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";

function AccountPage() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accountEditState, setAccountEditState] = useState<AccountEditModel>({
    isEditing: false,
    fieldType: null,
  } as AccountEditModel);
  const navigate = useNavigate();
  const [fieldValue, setFieldValue] = useState<AccountFieldValue>({
    userId: -1,
    value: "",
    type: null,
  } as AccountFieldValue);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewModel[]>([] as ReviewModel[]);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<number>(0);
  const [backlog, setBacklog] = useState<BacklogModel[]>([] as BacklogModel[]);
  const [selectedBacklogFilter, setSelectedBacklogFilter] = useState<number>(0);
  const setConfirmationDialog = useSetRecoilState(ConfirmationDialogState);

  useEffect(() => {
    if (user?.id !== undefined) {
      FetchReviews(0);
      FetchBacklog(0);
    }
  }, [user]);

  async function FetchReviews(offset: number) {
    setIsLoading(true);
    const reviewsData = await GetReviews(user.id, offset);
    setReviews(reviewsData);
    setIsLoading(false);
  }

  async function FetchBacklog(offset: number) {
    setIsLoading(true);
    const backlogData = await GetBacklog(user.id, offset);
    setBacklog(backlogData);
    setIsLoading(false);
  }

  async function LoadMoreReviews() {
    setIsLoading(true);
    const reviewsData = await GetReviews(user.id, reviews.length);
    setReviews([...reviews, ...reviewsData]);
    setIsLoading(false);
  }

  async function LoadMoreBacklogs() {
    setIsLoading(true);
    const backlogData = await GetBacklog(user.id, backlog.length);
    setBacklog([...backlog, ...backlogData]);
    setIsLoading(false);
  }

  function ResetAccountField() {
    setFieldValue({ userId: user.id, value: "", type: null });
    setAccountEditState({
      isEditing: false,
      fieldType: null,
    });
  }

  async function UpdateAccountField() {
    const userData = await UpdateUser(fieldValue);
    setUser(userData);
    Snackbar("Account Updated", "success");
    ResetAccountField();
  }

  function filteredReviews() {
    if (selectedReviewFilter === 1)
      return reviews.filter((review) => review.mediaType === MediaType.Movie);
    else if (selectedReviewFilter === 2)
      return reviews.filter((review) => review.mediaType === MediaType.Series);
    else if (selectedReviewFilter === 3)
      return reviews.filter((review) => review.mediaType === MediaType.Game);
    else if (selectedReviewFilter === 4)
      return reviews.filter((review) => review.mediaType === MediaType.Episode);
    return reviews;
  }

  function filteredBacklog() {
    if (selectedBacklogFilter === 1)
      return backlog.filter((media) => media.mediaType === MediaType.Movie);
    else if (selectedBacklogFilter === 2)
      return backlog.filter((media) => media.mediaType === MediaType.Series);
    else if (selectedBacklogFilter === 3)
      return backlog.filter((media) => media.mediaType === MediaType.Game);
    return backlog;
  }

  const cancelEditReviewDialog = {
    show: true,
    title: "Discard unsaved changes",
    dialog: "This will delete all edits since you last saved",
    cancel_text: "Keep Editing",
    confirm_text: "Discard",
    confirm_action: () => ResetAccountField(),
  } as unknown as ConfirmationDialogModel;

  const saveReviewDialog = {
    show: true,
    title: "Save changes",
    dialog: "This will save your changes",
    cancel_text: "Keep Editing",
    confirm_text: "Save",
    confirm_action: null,
  } as unknown as ConfirmationDialogModel;

  return (
    <>
      <div className="accountpage-container">
        {isLoading ? (
          <Loader />
        ) : user.id === null ? (
          <AccountLogin />
        ) : (
          <div className="account">
            <TopBar hideAccount topbarColor="rgba(151, 18, 18, 1)" />
            <section className="account-details">
              <div className="account-header">
                <h1>ACCOUNT DETAILS</h1>
              </div>
              <div className="account-info">
                <div className="info-item">
                  <span className="info-label w-1/3">Email</span>
                  {accountEditState.isEditing &&
                  accountEditState.fieldType === AccountFieldType.Email ? (
                    <form
                      className="info-value w-1/3"
                      id="email-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setConfirmationDialog({
                          ...saveReviewDialog,
                          confirm_action: () => UpdateAccountField(),
                        });
                      }}
                    >
                      <input
                        className="input"
                        type="email"
                        placeholder="Enter new email..."
                        autoComplete="off"
                        value={fieldValue.value}
                        onChange={(e) =>
                          setFieldValue({
                            userId: user.id,
                            value: e.target.value,
                            type: AccountFieldType.Email,
                          })
                        }
                        required
                      />
                    </form>
                  ) : (
                    <span className="info-value w-1/3">{user.email}</span>
                  )}
                  <div className="info-action w-1/3">
                    {accountEditState.isEditing &&
                      accountEditState.fieldType === AccountFieldType.Email && (
                        <button
                          disabled={
                            !accountEditState.isEditing &&
                            accountEditState.fieldType !==
                              AccountFieldType.Email
                          }
                          className="cancel-btn"
                          onClick={() =>
                            setConfirmationDialog(cancelEditReviewDialog)
                          }
                        >
                          Cancel <FontAwesomeIcon icon={faCancel} />
                        </button>
                      )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType === AccountFieldType.Email && (
                        <button className="save-btn" form="email-form">
                          Save <FontAwesomeIcon icon={faSave} />
                        </button>
                      )}
                    {accountEditState.fieldType !== AccountFieldType.Email && (
                      <button
                        className="edit-btn"
                        disabled={accountEditState.isEditing}
                        onClick={() =>
                          setAccountEditState({
                            isEditing: true,
                            fieldType: AccountFieldType.Email,
                          })
                        }
                      >
                        Edit <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label w-1/3">Password</span>
                  {accountEditState.isEditing &&
                  accountEditState.fieldType === AccountFieldType.Password ? (
                    <form
                      className="info-value w-1/3"
                      id="password-form"
                      hidden={
                        !accountEditState.isEditing &&
                        accountEditState.fieldType !== AccountFieldType.Password
                      }
                      onSubmit={(e) => {
                        e.preventDefault();
                        setConfirmationDialog({
                          ...saveReviewDialog,
                          confirm_action: () => UpdateAccountField(),
                        });
                      }}
                    >
                      <input
                        className="input"
                        type="password"
                        placeholder="Enter new password..."
                        autoComplete="off"
                        value={fieldValue.value}
                        onChange={(e) =>
                          setFieldValue({
                            userId: user.id,
                            value: e.target.value,
                            type: AccountFieldType.Password,
                          })
                        }
                        required
                      />
                    </form>
                  ) : (
                    <span className="info-value w-1/3">********</span>
                  )}
                  <div className="info-action w-1/3">
                    {accountEditState.isEditing &&
                      accountEditState.fieldType ===
                        AccountFieldType.Password && (
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            setConfirmationDialog(cancelEditReviewDialog)
                          }
                        >
                          Cancel <FontAwesomeIcon icon={faCancel} />
                        </button>
                      )}
                    {accountEditState.isEditing &&
                      accountEditState.fieldType ===
                        AccountFieldType.Password && (
                        <button className="save-btn" form="password-form">
                          Save <FontAwesomeIcon icon={faSave} />
                        </button>
                      )}
                    {accountEditState.fieldType !==
                      AccountFieldType.Password && (
                      <button
                        className="edit-btn"
                        disabled={accountEditState.isEditing}
                        onClick={() =>
                          setAccountEditState({
                            isEditing: true,
                            fieldType: AccountFieldType.Password,
                          })
                        }
                      >
                        Edit <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <AppBar position="static">
              <Tabs
                value={activeTab}
                onChange={(_e, v) => setActiveTab(v)}
                variant="fullWidth"
              >
                <Tab label="Reviews" />
                <Tab label="Backlog" />
              </Tabs>
            </AppBar>
            <div className="tab-panel" tabIndex={0} hidden={activeTab !== 0}>
              <div className="actions">
                <CustomTooltip
                  title={
                    reviews.length === user.totalReviews && "All reviews loaded"
                  }
                  arrow
                >
                  <span>
                    <button
                      className="load-btn"
                      disabled={reviews.length === user.totalReviews}
                      onClick={() => LoadMoreReviews()}
                    >
                      Load More <FontAwesomeIcon icon={faSpinner} />
                    </button>
                  </span>
                </CustomTooltip>
                <Select
                  variant="standard"
                  value={selectedReviewFilter}
                  onChange={(e) =>
                    setSelectedReviewFilter(Number(e.target.value))
                  }
                >
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>Movies</MenuItem>
                  <MenuItem value={2}>Series</MenuItem>
                  <MenuItem value={3}>Games</MenuItem>
                  <MenuItem value={4}>Episodes</MenuItem>
                </Select>
              </div>
              {filteredReviews().length === 0 ? (
                <div className="media-reviews empty">No Media Reviewed</div>
              ) : (
                <div className="media-reviews">
                  {filteredReviews().map((review) => {
                    return (
                      <div
                        key={review.mediaId}
                        className="review"
                        onClick={() =>
                          navigate(`/view-review/${review.id}}`, {
                            state: { reviewId: review.id },
                          })
                        }
                      >
                        <div className="tag">
                          {CapitaliseFirstLetter(review.mediaType)}
                        </div>
                        {review.mediaPoster === "N/A" ? (
                          <div className="image empty">
                            <FontAwesomeIcon icon={faImage} />
                          </div>
                        ) : (
                          <img className="image" src={review.mediaPoster} />
                        )}
                        <div className="review-info">
                          <h3>
                            {review.mediaParentTitle ?? review.mediaTitle}
                            {review.mediaType === MediaType.Episode &&
                              ` | S${review.mediaSeason}:E${review.mediaEpisode}`}
                          </h3>
                          <p>{review.mediaParentTitle && review.mediaTitle}</p>
                          <p>
                            Reviewed:{" "}
                            {CapitaliseFirstLetter(
                              formatDistanceToNowStrict(review.date) + " ago"
                            )}
                          </p>
                          <Rating
                            style={{ fontSize: "2rem" }}
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
            <div className="tab-panel" tabIndex={1} hidden={activeTab !== 1}>
              <div className="actions">
                <CustomTooltip
                  title={
                    backlog.length === user.totalBacklogs &&
                    "All reviews loaded"
                  }
                  arrow
                >
                  <span>
                    <button
                      className="load-btn"
                      disabled={backlog.length === user.totalBacklogs}
                      onClick={() => LoadMoreBacklogs()}
                    >
                      Load More <FontAwesomeIcon icon={faSpinner} />
                    </button>
                  </span>
                </CustomTooltip>
                <Select
                  variant="standard"
                  value={selectedBacklogFilter}
                  onChange={(e) =>
                    setSelectedBacklogFilter(Number(e.target.value))
                  }
                >
                  <MenuItem value={0}>None</MenuItem>
                  <MenuItem value={1}>Movies</MenuItem>
                  <MenuItem value={2}>Series</MenuItem>
                  <MenuItem value={3}>Games</MenuItem>
                </Select>
              </div>
              {filteredBacklog().length === 0 ? (
                <div className="backlog empty">No Backlogged Media</div>
              ) : (
                <div className="backlog">
                  {filteredBacklog().map((media) => {
                    return (
                      <div
                        key={media.mediaId}
                        className="media"
                        onClick={() =>
                          navigate(`/media/${media.mediaId}}`, {
                            state: { mediaId: media.mediaId },
                          })
                        }
                      >
                        <div className="tag">
                          {CapitaliseFirstLetter(media.mediaType)}
                        </div>
                        {media.mediaPoster === "N/A" ? (
                          <div className="image empty">
                            <FontAwesomeIcon icon={faImage} />
                          </div>
                        ) : (
                          <img className="image" src={media.mediaPoster} />
                        )}
                        <div className="backlog-info">{media.mediaTitle}</div>
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
