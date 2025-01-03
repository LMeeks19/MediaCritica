import "./AccountPage.scss";
import TopBar from "../Components/TopBar";
import { userState } from "../State/GlobalState";
import { useEffect, useState } from "react";
import {
  GetBacklog,
  GetBackloggedBacklog,
  GetFinishedBacklog,
  GetInProgressBacklog,
  GetUserReviews,
  UpdateBacklogState,
} from "../Server/Server";
import {
  AppBar,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { formatDistanceToNowStrict } from "date-fns";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import { useRecoilValue } from "recoil";
import AccountDetail from "../Components/AccountDetail";
import { AccountFieldType } from "../Enums/AccountFieldType";
import ThemePreference from "../Components/ThemePreference";
import PalettePreference from "../Components/PalettePreference";
import { BacklogObjectModel } from "../Interfaces/BacklogObjectModel";
import { BacklogModel } from "../Interfaces/BacklogModel";
import { BacklogCategoryType } from "../Enums/BacklogCategoryType";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import DeleteAccountAction from "../Components/DeleteAccountAction";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SortIcon from "@mui/icons-material/Sort";

function AccountPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewModel[]>([] as ReviewModel[]);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<number>(0);
  const [backlog, setBacklog] = useState<BacklogObjectModel>(
    {} as BacklogObjectModel
  );
  const [selectedBacklogLayout, setSelectedBacklogLayout] = useState<number>(0);

  useEffect(() => {
    if (user.id === null || user.id === undefined) navigate("/login");
    if (activeTab === 1 && reviews.length === 0) FetchReviews(0);
    else if (activeTab === 2 && getTotalLoadedBacklogs() === 0) FetchBacklog();
    else setIsLoading(false);
  }, [activeTab]);

  function getTotalLoadedBacklogs() {
    return (
      (backlog.backlog?.length ?? 0) +
      (backlog.inProgress?.length ?? 0) +
      (backlog.finished?.length ?? 0)
    );
  }

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

  async function FetchMoreBacklogs(
    stage: keyof BacklogObjectModel,
    offset: number
  ): Promise<BacklogModel[]> {
    if (stage === "inProgress")
      return await GetInProgressBacklog(user.id, offset, 10);
    else if (stage === "finished")
      return await GetFinishedBacklog(user.id, offset, 10);
    return await GetBackloggedBacklog(user.id, offset, 10);
  }

  async function LoadMoreBacklogs(stage: keyof BacklogObjectModel) {
    setIsLoading(true);

    const updatedBacklog = { ...backlog };
    const stageToUpdate = updatedBacklog[stage] as BacklogModel[];

    const newBacklogData = await FetchMoreBacklogs(stage, stageToUpdate.length);

    (updatedBacklog[stage] as BacklogModel[]) = [
      ...stageToUpdate,
      ...newBacklogData,
    ];

    setBacklog(updatedBacklog);
    setIsLoading(false);
  }

  function filteredReviews() {
    if (selectedReviewFilter === 1)
      return reviews.filter((review) => review.mediaType === MediaType.Movie);
    else if (selectedReviewFilter === 2)
      return reviews.filter((review) => review.mediaType === MediaType.Series);
    else if (selectedReviewFilter === 3)
      return reviews.filter((review) => review.mediaType === MediaType.Game);
    return reviews;
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    stage: keyof BacklogObjectModel,
    index: number
  ) => {
    (e as React.DragEvent<HTMLDivElement>).dataTransfer.setData(
      "text/plain",
      JSON.stringify({ stage, index })
    );
    return false;
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

    increaseTotalCount(updatedBacklog, targetStage);
    decreaseTotalCount(updatedBacklog, sourceStage);

    setBacklog(updatedBacklog);
  };

  function increaseTotalCount(
    updatedBacklog: BacklogObjectModel,
    stage: string
  ): number {
    if (stage === "inProgress")
      return (updatedBacklog.totalInProgressCount += 1);
    else if (stage === "finished")
      return (updatedBacklog.totalFinishedCount += 1);
    return (updatedBacklog.totalBacklogCount += 1);
  }

  function decreaseTotalCount(
    updatedBacklog: BacklogObjectModel,
    stage: string
  ): number {
    if (stage === "inProgress")
      return (updatedBacklog.totalInProgressCount -= 1);
    else if (stage === "finished")
      return (updatedBacklog.totalFinishedCount -= 1);
    return (updatedBacklog.totalBacklogCount -= 1);
  }

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

  function sorted(items: BacklogModel[], sorter: number): BacklogModel[] {
    if (sorter === 1) {
      return (
        items.sort(
          (a, b) =>
            new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
        ) ?? []
      );
    } else if (sorter === 2) {
      return (
        items.sort((a, b) => a.mediaTitle.localeCompare(b.mediaTitle)) ?? []
      );
    } else if (sorter === 3) {
      return (
        items.sort((a, b) => b.mediaTitle.localeCompare(a.mediaTitle)) ?? []
      );
    }
    return (
      items.sort(
        (a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      ) ?? []
    );
  }

  function BacklogSection({
    title,
    stage,
    items,
    totalItems,
  }: {
    title: string;
    stage: keyof BacklogObjectModel;
    items: BacklogModel[];
    totalItems: number;
  }) {
    const [selectedFilter, setSelectedFilter] = useState<number>(0);
    const [selectedSorter, setSelectedSorter] = useState<number>(0);

    return (
      <div className="backlog-section">
        <div className="sub-header palette">
          <h2>{title}</h2>
          <div className="actions">
            <FormControl
              variant="outlined"
              sx={{ width: 250 }}
              disabled={items?.length === 0}
              fullWidth
            >
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                value={selectedSorter}
                onChange={(e) => setSelectedSorter(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value={0}>Date (New - Old)</MenuItem>
                <MenuItem value={1}>Date (Old - New)</MenuItem>
                <MenuItem value={2}>Alphabetical (A-Z)</MenuItem>
                <MenuItem value={3}>Aplhabetical (Z-A)</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              sx={{ width: 150 }}
              disabled={items?.length === 0}
              fullWidth
            >
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(Number(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltOutlinedIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Movies</MenuItem>
                <MenuItem value={2}>Series</MenuItem>
                <MenuItem value={3}>Games</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="items-container">
          <div
            className={`items ${
              filtered(items, selectedFilter).length === 0 && "empty"
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {filtered(items, selectedFilter).length === 0 ? (
              <div
                className={`flex items-center justify-center w-full ${
                  selectedBacklogLayout === 0 && "h-[281.25px]"
                }`}
              >
                No {title} Media
              </div>
            ) : (
              filtered(sorted(items, selectedSorter), selectedFilter).map(
                (item, index) => (
                  <div
                    key={item.id}
                    draggable
                    className="item"
                    onDragStart={(e) => handleDragStart(e, stage, index)}
                    onClick={() =>
                      navigate(`/media/${item.mediaId}`, {
                        state: {
                          mediaId: item.mediaId,
                          mediaType: item.mediaType,
                        },
                      })
                    }
                    style={{ backgroundImage: `url(${item.mediaPoster})` }}
                  >
                    <div className="item-tag">
                      {CapitaliseFirstLetter(item.mediaType)}
                    </div>
                    <div className="item-title">{item.mediaTitle}</div>
                  </div>
                )
              )
            )}
            <div
              className={`flex justify-center items-center p-6 ${
                items?.length === totalItems && "hidden"
              }`}
            >
              <CustomTooltip title="Load more" arrow>
                <span>
                  <Fab
                    className="load-btn"
                    disabled={items?.length === totalItems}
                    onClick={() => LoadMoreBacklogs(stage)}
                  >
                    <AddIcon />
                  </Fab>
                </span>
              </CustomTooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="accountpage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="account">
          <TopBar hideAccount whiteText />
          <AppBar position="static">
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              variant="fullWidth"
            >
              <Tab value={0} label="Details" />
              <Tab value={1} label="Reviews" />
              <Tab value={2} label="Backlog" />
            </Tabs>
          </AppBar>
          <div className="account-tab" tabIndex={0} hidden={activeTab !== 0}>
            <div className="header dark-shade">
              <h1>DETAILS</h1>
              <button
                className="logout-btn"
                onClick={() => {
                  navigate("/login");
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
            <div className="header dark-shade">
              <h1>PREFERENCES</h1>
            </div>
            <div className="account-details">
              <ThemePreference />
              <PalettePreference />
            </div>
            <div className="header dark-shade">
              <h1>ACTIONS</h1>
            </div>
            <div className="account-details">
              <DeleteAccountAction />
            </div>
          </div>
          <div className="reviews-tab" tabIndex={1} hidden={activeTab !== 1}>
            <div className="reviews-container">
              <div className="header dark-shade">
                <h1>REVIEWS</h1>
                <div className="actions">
                  <FormControl variant="outlined" sx={{ width: 250 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                      label="Filter"
                      value={selectedReviewFilter}
                      onChange={(e) =>
                        setSelectedReviewFilter(Number(e.target.value))
                      }
                    >
                      <MenuItem value={0}>None</MenuItem>
                      <MenuItem value={1}>Movies</MenuItem>
                      <MenuItem value={2}>Series</MenuItem>
                      <MenuItem value={3}>Games</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="layout">
                {filteredReviews().length === 0 ? (
                  <div className="reviews empty">No Media Reviewed</div>
                ) : (
                  <div className="reviews">
                    {filteredReviews().map((review) => {
                      return (
                        <div
                          key={review.mediaId}
                          className="review-card"
                          onClick={() =>
                            navigate(
                              `/media/${review.mediaId}/view-review/${review.id}}`,
                              {
                                state: { reviewId: review.id },
                              }
                            )
                          }
                        >
                          {review.mediaPoster !== null ? (
                            <div
                              className="review-image "
                              style={{
                                backgroundImage: `url(${review.mediaPoster})`,
                              }}
                            >
                              <span className="tag">
                                {CapitaliseFirstLetter(review.mediaType)}
                              </span>
                            </div>
                          ) : (
                            <div className="review-image empty">
                              <FontAwesomeIcon
                                className="text-9xl"
                                icon={faImage}
                              />
                              <span className="tag">
                                {CapitaliseFirstLetter(review.mediaType)}
                              </span>
                            </div>
                          )}
                          <div className="review-content">
                            <h2>{review.mediaTitle}</h2>
                            <p className="review-time">
                              {formatDistanceToNowStrict(review.date)} ago
                            </p>
                            <Rating
                              className="rating"
                              value={review.rating}
                              readOnly
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className={`flex justify-center items-center p-6 ${
                        reviews.length === user.totalReviews && "hidden"
                      }`}
                    >
                      <CustomTooltip title="All reviewed media loaded" arrow>
                        <span>
                          <Fab
                            className="load-btn"
                            disabled={reviews.length === user.totalReviews}
                            onClick={() => LoadMoreReviews()}
                          >
                            <AddIcon />
                          </Fab>
                        </span>
                      </CustomTooltip>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="backlog-tab" tabIndex={2} hidden={activeTab !== 2}>
            <div className="backlog-container">
              <div className="header dark-shade">
                <h1>BACKLOG</h1>
                <ToggleButtonGroup
                  value={selectedBacklogLayout}
                  onChange={(_e, v) => setSelectedBacklogLayout(v)}
                  exclusive
                >
                  <ToggleButton value={0}>
                    <TableRowsIcon />
                  </ToggleButton>
                  <ToggleButton value={1}>
                    <ViewColumnIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div
                className={`layout ${
                  selectedBacklogLayout === 0 ? "row" : "col"
                }`}
              >
                <BacklogSection
                  title="Not Started"
                  stage="backlog"
                  items={backlog.backlog}
                  totalItems={backlog.totalBacklogCount}
                />
                <BacklogSection
                  title="In Progress"
                  stage="inProgress"
                  items={backlog.inProgress}
                  totalItems={backlog.totalInProgressCount}
                />

                <BacklogSection
                  title="Finished"
                  stage="finished"
                  items={backlog.finished}
                  totalItems={backlog.totalFinishedCount}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
