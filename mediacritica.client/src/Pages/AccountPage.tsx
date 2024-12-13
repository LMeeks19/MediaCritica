import TopBar from "../Components/TopBar";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { FormEvent, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { GetBacklog, GetReviews, UpdateUser } from "../Server/Server";
import { MenuItem, Rating, Select, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEdit,
  faPlus,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import {
  AccountEditModel,
  AccountFieldValue,
} from "../Interfaces/AccountModels";
import { AccountFieldType } from "../Enums/AccountFieldType";
import { Snackbar } from "../Components/Snackbar";
import TabPanel from "../Components/TabPanel";
import { ReviewModel } from "../Interfaces/ReviewModel";
import "./AccountPage.scss";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { BacklogModel } from "../Interfaces/BacklogModel";

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

  async function UpdateAccountField(event: FormEvent) {
    event.preventDefault();
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
        ) : user.id === null ? (
          <AccountLogin />
        ) : (
          <div className="account">
            <div className="flex flex-col w-full">
              <div className="section-heading">Account</div>
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
                            userId: user.id,
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
                            userId: user.id,
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
            <div className="flex flex-col w-full">
              <Tabs
                value={activeTab}
                onChange={(_e, v) => setActiveTab(v)}
                variant="fullWidth"
                centered
              >
                <Tab label="Reviews" />
                <Tab label="Backlog" />
              </Tabs>
              <TabPanel value={activeTab} index={0}>
                <div className="flex flex-wrap w-full gap-6 mt-10">
                  <div className="section-heading w-full justify-between">
                    <div className="w-1/2">Reviews</div>
                    <div className="w-1/2 flex justify-end">
                      <Select
                        className="w-1/2"
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
                  </div>
                  <div className="flex flex-col grow overflow-x-auto w-full">
                    {filteredReviews()?.length === 0 ? (
                      <div className="media-reviews empty">
                        No Media Reviewed
                      </div>
                    ) : (
                      <div className="media-reviews">
                        {filteredReviews()?.map((review) => {
                          return (
                            <div
                              key={review.mediaId}
                              className="review"
                              style={{
                                backgroundImage: `url(${review.mediaPoster})`,
                              }}
                              onClick={() =>
                                navigate(`/view-review/${review.mediaId}}`, {
                                  state: { mediaId: review.mediaId },
                                })
                              }
                            >
                              <div className="type">
                                {CapitaliseFirstLetter(review.mediaType)}
                              </div>
                              <div className="details">
                                <div className="title">
                                  {review.mediaParentTitle ?? review.mediaTitle}
                                  {review.mediaType === MediaType.Episode &&
                                    ` | S${review.mediaSeason}:E${review.mediaEpisode}`}
                                  <div className="sub-title">
                                    {review.mediaParentTitle &&
                                      review.mediaTitle}
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
                        {(reviews.length !== user.totalReviews ||
                          user.totalReviews > 20) && (
                          <div
                            className="review load"
                            onClick={() => LoadMoreReviews()}
                          >
                            Load More
                            <FontAwesomeIcon icon={faPlus} size="lg" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <div className="flex flex-col gap-6 w-full mt-10">
                  <div className="section-heading w-full justify-between">
                    <div className="w-1/2">Backlog</div>
                    <div className="w-1/2 flex justify-end">
                      <Select
                        className="w-1/2"
                        variant="standard"
                        value={selectedBacklogFilter}
                        onChange={(e) =>
                          setSelectedBacklogFilter(Number(e.target.value))
                        }
                      >
                        <MenuItem value={0}>None</MenuItem>
                        <MenuItem value={1}>Movie</MenuItem>
                        <MenuItem value={2}>Series</MenuItem>
                        <MenuItem value={3}>Game</MenuItem>
                      </Select>
                    </div>
                  </div>
                  {filteredBacklog()?.length === 0 ? (
                    <div className="backlog empty">No Backlogged Media</div>
                  ) : (
                    <div className="backlog">
                      {backlog.map((media) => {
                        return (
                          <div
                            key={media.mediaId}
                            className="media"
                            style={{
                              backgroundImage: `url(${media.mediaPoster})`,
                            }}
                            onClick={() =>
                              navigate(`/media/${media.mediaId}}`, {
                                state: { mediaId: media.mediaId },
                              })
                            }
                          >
                            <div className="type">
                              {CapitaliseFirstLetter(media.mediaType)}
                            </div>
                            <div className="details">
                              <div className="title">{media.mediaTitle}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {(backlog.length !== user.totalBacklogs ||
                    user.totalBacklogs > 20) && (
                    <div
                      className="media load"
                      onClick={() => LoadMoreBacklogs()}
                    >
                      Load More
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </div>
                  )}
                </div>
              </TabPanel>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AccountPage;
