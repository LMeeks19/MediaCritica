import "./AccountPage.scss";
import TopBar from "../Components/TopBar";
import { userState } from "../State/GlobalState";
import { useEffect, useState } from "react";
import {
  GetBacklog,
  GetBackloggedBacklog,
  GetFinishedBacklog,
  GetInProgressBacklog,
  GetUserMilestones,
  GetUserReviews,
  GetUserReviewsBreakdown,
  UpdateBacklogState,
} from "../Server/Server";
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Fab,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
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
import ViewColumnIcon from "@mui/icons-material/ViewColumnOutlined";
import TableRowsIcon from "@mui/icons-material/TableRowsOutlined";
import DeleteAccountAction from "../Components/DeleteAccountAction";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SortIcon from "@mui/icons-material/Sort";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import { format } from "date-fns";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import MilestonesAccordion from "../Components/MilestonesAccordion";
import { BarChart } from "@mui/x-charts/BarChart";

function AccountPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewModel[]>([] as ReviewModel[]);

  const starRatings: any[] = [];
  for (let i = 0; i <= 5; i += 0.5) {
    if (i === 1) starRatings.push(`${i} Star`);
    else starRatings.push(`${i} Stars`);
  }
  const [reviewsBreakdown, setReviewsBreakdown] = useState<number[]>([]);

  const [selectedReviewFilter, setSelectedReviewFilter] =
    useState<string>("None");
  const [backlog, setBacklog] = useState<BacklogObjectModel>(
    {} as BacklogObjectModel
  );
  const [selectedBacklogLayout, setSelectedBacklogLayout] = useState<number>(0);
  const [milestones, setMilestones] = useState<UserMilestoneModelObject[]>(
    [] as UserMilestoneModelObject[]
  );

  useEffect(() => {
    if (user.id === undefined) navigate("/login");
    if (activeTab === 1 && reviews.length === 0) FetchReviews(0);
    else if (activeTab === 2 && getTotalLoadedBacklogs() === 0) FetchBacklog();
    else if (activeTab === 3) FetchMilestones();
    else setIsLoading(false);
  }, [activeTab]);

  function getTotalLoadedBacklogs() {
    return (
      (backlog.backlog?.length ?? 0) +
      (backlog.inProgress?.length ?? 0) +
      (backlog.finished?.length ?? 0)
    );
  }

  async function FetchMilestones() {
    setIsLoading(true);
    const milestoneData = await GetUserMilestones(user.id);
    setMilestones(milestoneData);
    setIsLoading(false);
  }

  async function FetchReviews(offset: number) {
    setIsLoading(true);
    const reviewsData = await GetUserReviews(user.id, offset);
    setReviews(reviewsData);
    const reviewsBreakdownData = await GetUserReviewsBreakdown(user.id);
    setReviewsBreakdown(reviewsBreakdownData);
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
    if (selectedReviewFilter === MediaType.Movie)
      return reviews.filter((review) => review.mediaType === MediaType.Movie);
    else if (selectedReviewFilter === MediaType.Series)
      return reviews.filter((review) => review.mediaType === MediaType.Series);
    else if (selectedReviewFilter === MediaType.Game)
      return reviews.filter((review) => review.mediaType === MediaType.Game);
    else if (selectedReviewFilter === MediaType.Episode)
      return reviews.filter((review) => review.mediaType === MediaType.Episode);
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
                  <Card
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, stage, index)}
                    key={item.id}
                  >
                    <img
                      className="image"
                      src={item.mediaPoster?.replace("300.jpg", "180.jpg")}
                      alt={item.mediaTitle}
                    />
                    <CardActionArea
                      onClick={() =>
                        navigate(`/media/${item.mediaId}`, {
                          state: {
                            mediaId: item.mediaId,
                            mediaType: item.mediaType,
                          },
                        })
                      }
                    >
                      <CardMedia />
                      <CardHeader title={item.mediaTitle} />
                      <Divider />
                      <CardContent>
                        <div className="flex justify-around">
                          <Typography>
                            {CapitaliseFirstLetter(item.mediaType)}
                          </Typography>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
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
    user.id !== undefined && (
      <div className="accountpage-container">
        <div className="account">
          <TopBar whiteText />
          <AppBar position="static">
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              variant="fullWidth"
            >
              <Tab value={0} label="Details" />
              <Tab value={1} label="Reviews" />
              <Tab value={2} label="Backlog" />
              <Tab value={3} label="Milestones" />
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
                Logout <LogoutIcon fontSize="small" />
              </button>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <>
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
              </>
            )}
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
                      onChange={(e) => setSelectedReviewFilter(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value={MediaType.Movie}>Movies</MenuItem>
                      <MenuItem value={MediaType.Series}>Series</MenuItem>
                      <MenuItem value={MediaType.Game}>Games</MenuItem>
                      <MenuItem value={MediaType.Episode}>Episodes</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="layout">
                  {filteredReviews().length === 0 ? (
                    <div className="reviews empty">
                      No {selectedReviewFilter} Reviewed
                    </div>
                  ) : (
                    <div className="reviews">
                      {filteredReviews().map((review) => {
                        return (
                          <Card key={review.id}>
                            <img
                              className="image"
                              src={review.mediaPoster?.replace(
                                "300.jpg",
                                "180.jpg"
                              )}
                              alt={review.mediaTitle}
                            />
                            <CardActionArea
                              onClick={() =>
                                navigate(
                                  `/media/${review.mediaId}/view-review/${review.id}}`,
                                  {
                                    state: { reviewId: review.id },
                                  }
                                )
                              }
                            >
                              <CardMedia />
                              <CardHeader title={review.title} />
                              <Divider />
                              <CardContent>
                                <Typography>{review.mediaTitle}</Typography>
                                <Typography>
                                  {format(review.date, "do MMMM yyyy")}
                                </Typography>
                                <div className="flex justify-around">
                                  <Typography>
                                    {CapitaliseFirstLetter(review.mediaType)}
                                  </Typography>
                                  <Typography
                                    component="div"
                                    className="flex items-center gap-1"
                                  >
                                    <GradeIcon
                                      style={{
                                        fontSize: 14,
                                        color: "var(--rating-star)",
                                      }}
                                    />
                                    <div className="">{review.rating}</div>
                                  </Typography>
                                </div>
                              </CardContent>
                            </CardActionArea>
                          </Card>
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
                  <div className="sub-header dark-shade">
                    <h2>Breakdown</h2>
                  </div>
                  <div className="breakdown">
                    <BarChart
                      colors={["var(--palette-colour)"]}
                      height={450}
                      margin={{ top: 30, left: 40, right: 10 }}
                      borderRadius={8}
                      series={[
                        {
                          data: reviewsBreakdown,
                        },
                      ]}
                      xAxis={[
                        {
                          data: starRatings,
                          scaleType: "band",
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <Loader />
              ) : (
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
              )}
            </div>
          </div>
          <div className="milestones-tab" tabIndex={3} hidden={activeTab !== 3}>
            <div className="milestones-container">
              <div className="header dark-shade">
                <h1>MILESTONES</h1>
              </div>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="layout">
                  <MilestonesAccordion object={milestones.at(0)!} />
                  <MilestonesAccordion object={milestones.at(1)!} />
                  <MilestonesAccordion object={milestones.at(2)!} />
                  <MilestonesAccordion object={milestones.at(3)!} />
                  <MilestonesAccordion object={milestones.at(4)!} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default AccountPage;
