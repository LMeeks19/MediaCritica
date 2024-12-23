import TopBar from "../Components/TopBar";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import { useEffect, useState } from "react";
import {
  GetBacklog,
  GetUserReviews,
  UpdateBacklogState,
} from "../Server/Server";
import { AppBar, MenuItem, Rating, Select, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import { useRecoilState } from "recoil";
import AccountDetail from "../Components/AccountDetail";
import { AccountFieldType } from "../Enums/AccountFieldType";
import { UserModel } from "../Interfaces/UserModel";
import ThemePreference from "../Components/ThemePreference";
import $ from "jquery";
import PalettePreference from "../Components/PalettePreference";
import { BacklogObjectModel } from "../Interfaces/BacklogObjectModel";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { BacklogCategoryType } from "../Enums/BacklogCategoryType";
import { Snackbar } from "../Components/Snackbar";
import "./AccountPage.scss";

function AccountPage() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewModel[]>([] as ReviewModel[]);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<number>(0);
  const [backlog, setBacklog] = useState<BacklogObjectModel>(
    {} as BacklogObjectModel
  );

  useEffect(() => {
    if (activeTab === 1 && user.totalReviews !== reviews.length)
      FetchReviews(0);
    else if (activeTab === 2) FetchBacklog();
    else setIsLoading(false);
  }, [activeTab]);

  async function FetchReviews(offset: number) {
    setIsLoading(true);
    const reviewsData = await GetUserReviews(user.id, offset);
    setReviews(reviewsData);
    setIsLoading(false);
  }

  async function FetchBacklog() {
    setIsLoading(true);
    const backlogData = await GetBacklog(user.id);
    setBacklog(backlogData);
    setIsLoading(false);
  }

  async function LoadMoreReviews() {
    setIsLoading(true);
    const reviewsData = await GetUserReviews(user.id, reviews.length);
    setReviews([...reviews, ...reviewsData]);
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

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    stage: keyof BacklogObjectModel,
    index: number
  ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ stage, index }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetStage: keyof BacklogObjectModel
  ) => {
    e.preventDefault();
    const { stage: sourceStage, index: sourceIndex } = JSON.parse(
      e.dataTransfer.getData("text/plain")
    ) as {
      stage: keyof BacklogObjectModel;
      index: number;
    };

    if (sourceStage === targetStage) return;

    const updatedBacklog = { ...backlog };
    const [movedItem] = (updatedBacklog[sourceStage] as BacklogModel[]).splice(
      sourceIndex,
      1
    );

    const newCategory =
      targetStage === "backlog"
        ? BacklogCategoryType.Backlog
        : targetStage === "inProgress"
        ? BacklogCategoryType.InProgress
        : BacklogCategoryType.Finished;

    UpdateBacklogState(movedItem.id, newCategory);

    (updatedBacklog[targetStage] as BacklogModel[]).push(movedItem);

    ((updatedBacklog[targetStage] as BacklogModel[]) = (
      updatedBacklog[targetStage] as BacklogModel[]
    ).sort(
      (a, b) =>
        new Date(b.addedDate).getMilliseconds() -
        new Date(a.addedDate).getMilliseconds()
    )),
      setBacklog(updatedBacklog);

    Snackbar(`${movedItem.mediaTitle} Updated`, "success");
  };

  function filtered(items: BacklogModel[], filter: number): BacklogModel[] {
    if (filter === 1) {
      return items.filter((item) => item.mediaType === MediaType.Movie) ?? [];
    } else if (filter === 2) {
      return items.filter((item) => item.mediaType === MediaType.Series) ?? [];
    } else if (filter === 3) {
      return items.filter((item) => item.mediaType === MediaType.Game) ?? [];
    }
    return items ?? [];
  }

  function RenderSection({
    title,
    stage,
    items,
  }: {
    title: string;
    stage: keyof BacklogObjectModel;
    items: BacklogModel[];
  }) {
    const [selectedFilter, setSelectedFilter] = useState<number>(0);

    return (
      <div className="grid-wrapper">
        <div className="header">
          <h1>{title.toUpperCase()}</h1>
          <Select
            className="select"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(Number(e.target.value))}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Movies</MenuItem>
            <MenuItem value={2}>Series</MenuItem>
            <MenuItem value={3}>Games</MenuItem>
          </Select>
        </div>
        <div
          className="grid"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
        >
          {filtered(items, selectedFilter).length === 0 ? (
            <div className="flex items-center justify-center w-full h-[281.25px]">
              No Media
            </div>
          ) : (
            filtered(items, selectedFilter).map((item, index) => (
              <div
                key={item.id}
                draggable
                className="grid-item"
                onDragStart={(e) => handleDragStart(e, stage, index)}
                style={{ backgroundImage: `url(${item.mediaPoster})` }}
              >
                <div className="item-tag">
                  {CapitaliseFirstLetter(item.mediaType)}
                </div>
                <div className="item-title">{item.mediaTitle}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="accountpage-container">
      <TopBar hideAccount />
      {isLoading ? (
        <Loader />
      ) : user.id === null || user.id === undefined ? (
        <AccountLogin />
      ) : (
        <div className="account">
          <AppBar position="static">
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              variant="fullWidth"
            >
              <Tab label="Details" />
              <Tab label="Reviews" />
              <Tab label="Backlog" />
            </Tabs>
          </AppBar>
          <div className="tab-panel" tabIndex={0} hidden={activeTab !== 0}>
            <div className="header">
              <h1>DETAILS</h1>
              <button
                className="logout-btn"
                onClick={() => {
                  setUser({} as UserModel);
                  $(":root").css("color-scheme", "light dark");
                  $(":root").attr(
                    "style",
                    `--palette-color:var(--primary-red)`
                  );
                }}
              >
                Logout <FontAwesomeIcon icon={faSignOut} />
              </button>
            </div>
            <div className="account-details">
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
            <div className="header">
              <h1>PREFERENCES</h1>
            </div>
            <div className="account-details">
              <ThemePreference />
              <PalettePreference />
            </div>
          </div>
          <div className="tab-panel" tabIndex={1} hidden={activeTab !== 1}>
            <div className="header">
              <h1>REVIEWS</h1>
              <Select
                className="select"
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
                        <p>
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
            <div className="flex justify-center p-6">
              <CustomTooltip
                title={
                  reviews.length === user.totalReviews &&
                  "All reviewed media loaded"
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
            </div>
          </div>
          <div className="tab-panel" tabIndex={2} hidden={activeTab !== 2}>
            <RenderSection
              title="Backlog"
              stage="backlog"
              items={backlog.backlog}
            />
            <RenderSection
              title="In Progress"
              stage="inProgress"
              items={backlog.inProgress}
            />
            <RenderSection
              title="Finished"
              stage="finished"
              items={backlog.finished}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
