import TopBar from "../Components/TopBar";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { useEffect, useState } from "react";
import { GetBacklog, GetUserReviews } from "../Server/Server";
import { AppBar, MenuItem, Rating, Select, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import { useRecoilValue } from "recoil";
import "./AccountPage.scss";
import AccountDetail from "../Components/AccountDetail";
import { AccountFieldType } from "../Enums/AccountFieldType";

function AccountPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
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
    const reviewsData = await GetUserReviews(user.id, offset);
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
    const reviewsData = await GetUserReviews(user.id, reviews.length);
    setReviews([...reviews, ...reviewsData]);
    setIsLoading(false);
  }

  async function LoadMoreBacklogs() {
    setIsLoading(true);
    const backlogData = await GetBacklog(user.id, backlog.length);
    setBacklog([...backlog, ...backlogData]);
    setIsLoading(false);
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
      <div className="accountpage-container">
        {isLoading ? (
          <Loader />
        ) : user.id === null ? (
          <AccountLogin />
        ) : (
          <div className="account">
            <TopBar hideAccount topbarColor="rgba(151, 18, 18, 1)" />
            <div className="account-details">
              <div className="account-header">
                <h1>ACCOUNT DETAILS</h1>
              </div>
              <div className="account-info">
                <AccountDetail
                  accountFieldName="Forename"
                  accountFieldType={AccountFieldType.Forename}
                  accountFieldValue={user.forename}
                  inputType="text"
                />
                <AccountDetail
                  accountFieldName="Surname"
                  accountFieldType={AccountFieldType.Surname}
                  accountFieldValue={user.surname}
                  inputType="text"
                />
                <AccountDetail
                  accountFieldName="Email"
                  accountFieldType={AccountFieldType.Email}
                  accountFieldValue={user.email}
                  inputType="text"
                />
                <AccountDetail
                  accountFieldName="Password"
                  accountFieldType={AccountFieldType.Password}
                  accountFieldValue="********"
                  inputType="password"
                />
              </div>
            </div>
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
                    reviews.length === user.totalReviews && "All reviewed media loaded"
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
                          navigate(
                            `/media/${review.mediaId}/view-review/${review.id}}`,
                            {
                              state: { reviewId: review.id },
                            }
                          )
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
                    "All backlogged media loaded"
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
