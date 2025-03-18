import "./AccountPage.scss";
import TopBar from "../Components/TopBar";
import { notificationsState, userState } from "../State/GlobalState";
import { useEffect, useState, Fragment } from "react";
import {
  GetBacklog,
  GetBackloggedBacklog,
  GetFinishedBacklog,
  GetInProgressBacklog,
  GetUserFollowers,
  GetUserFollowing,
  GetUserMilestones,
  GetUserReviews,
  UpdateBacklogState,
} from "../Server/Server";
import {
  AppBar,
  Avatar,
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
  Button,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReviewModel } from "../Interfaces/ReviewModel";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import { MediaType } from "../Enums/MediaType";
import { CustomTooltip } from "../Components/Tooltip";
import Loader from "../Components/Loader";
import { useRecoilState, useSetRecoilState } from "recoil";
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
import SortIcon from "@mui/icons-material/Sort";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import { format } from "date-fns";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import MilestonesAccordion from "../Components/MilestonesAccordion";
import { BarChart } from "@mui/x-charts/BarChart";
import { UserFollowSummaryModel } from "../Interfaces/UserFollowSummaryModel";
import { LogoutUser } from "../Helpers/AuthenticationHelper";
import GameIcon from "@mui/icons-material/SportsEsportsOutlined";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import SeriesIcon from "@mui/icons-material/LiveTvOutlined";
import EpisodeIcon from "@mui/icons-material/SubscriptionsOutlined";

function AccountPage() {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [reviews, setReviews] = useState<ReviewModel[]>([] as ReviewModel[]);
  const setNotificationsObject = useSetRecoilState(notificationsState);

  const starRatings: any[] = [];
  for (let i = 0; i <= 5; i += 0.5) {
    if (i === 1) starRatings.push(`${i} Star`);
    else starRatings.push(`${i} Stars`);
  }
  const [reviewsBreakdown, setReviewsBreakdown] = useState<number[]>([]);

  const [selectedReviewFilter, setSelectedReviewFilter] = useState<string[]>(
    []
  );
  const [backlog, setBacklog] = useState<BacklogObjectModel>(
    {} as BacklogObjectModel
  );
  const [selectedBacklogLayout, setSelectedBacklogLayout] = useState<number>(0);
  const [milestones, setMilestones] = useState<UserMilestoneModelObject[]>(
    [] as UserMilestoneModelObject[]
  );

  useEffect(() => {
    if (activeTab === 1) FetchSocial();
    else if (activeTab === 2 && reviews.length === 0) FetchReviews(0);
    else if (activeTab === 3 && getTotalLoadedBacklogs() === 0) FetchBacklog();
    else if (activeTab === 4) FetchMilestones();
    else setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    if (user.id === undefined) navigate("/login");
  }, [user]);

  const [activeSocialTab, setActiveSocialTab] = useState<number>(0);
  const [followers, setFollowers] = useState<UserFollowSummaryModel[]>([]);
  const [following, setFollowing] = useState<UserFollowSummaryModel[]>([]);

  useEffect(() => {
    FetchSocial();
  }, [activeSocialTab]);

  async function FetchSocial() {
    setIsLoading(true);
    if (activeTab === 1) {
      if (activeSocialTab === 0 && followers.length < user.totalFollowers) {
        const followersData = await GetUserFollowers(user.id, followers.length);
        setFollowers(followersData);
      } else if (
        activeSocialTab === 1 &&
        following.length < user.totalFollowing
      ) {
        const followingData = await GetUserFollowing(user.id, following.length);
        setFollowing(followingData);
      }
    }
    setIsLoading(false);
  }

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
    setReviews(reviewsData.reviews);
    setReviewsBreakdown(reviewsData.breakdown);
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
    setReviews([...reviews, ...reviewsData.reviews]);
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

  function filteredReviews(items: ReviewModel[], filter: string[]) {
    if (filter.length === 0) return items;
    return items.filter((item) => filter.includes(item.mediaType));
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

  function filtered(items: BacklogModel[], filter: string[]): BacklogModel[] {
    if (filter.length === 0) return items ?? [];
    return items.filter((item) => filter.includes(item.mediaType)) ?? [];
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
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [selectedSorter, setSelectedSorter] = useState<number>(0);

    return (
      <div className="backlog-section">
        <div className="sub-header palette">
          <h2>{title}</h2>
          <div className="actions">
            <FormControl variant="outlined" sx={{ width: 250 }} fullWidth>
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
            <ToggleButtonGroup
              value={selectedFilter}
              onChange={(e, v) => {
                e.stopPropagation();
                if (v !== null) setSelectedFilter(v);
                else setSelectedFilter((prev) => prev.filter((f) => f !== v));
              }}
            >
              <ToggleButton value={MediaType.Movie}>
                <CustomTooltip title="Movies" arrow>
                  <MovieIcon />
                </CustomTooltip>
              </ToggleButton>
              <ToggleButton value={MediaType.Series}>
                <CustomTooltip title="Series" arrow>
                  <SeriesIcon />
                </CustomTooltip>
              </ToggleButton>
              <ToggleButton value={MediaType.Game}>
                <CustomTooltip title="Games" arrow>
                  <GameIcon />
                </CustomTooltip>
              </ToggleButton>
            </ToggleButtonGroup>
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
                  selectedBacklogLayout === 0 && "h-[225px]"
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
                      <CardMedia component="div" />
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
        <TopBar hideBack />
        <div className="account">
          <AppBar position="static">
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              variant="fullWidth"
            >
              <Tab value={0} label="Details" />
              <Tab value={1} label="Social" />
              <Tab value={2} label="Reviews" />
              <Tab value={3} label="Backlog" />
              <Tab value={4} label="Milestones" />
            </Tabs>
          </AppBar>
          <div className="account-tab" tabIndex={0} hidden={activeTab !== 0}>
            <div className="sub-header dark-shade">
              <h2>Details</h2>
              <ButtonGroup>
                <Button
                  onClick={async () => {
                    await LogoutUser(setNotificationsObject, setUser);
                  }}
                >
                  <CustomTooltip title="Logout" arrow>
                    <LogoutIcon fontSize="small" />
                  </CustomTooltip>
                </Button>
              </ButtonGroup>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <Fragment>
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
                <div className="sub-header dark-shade">
                  <h2>Preferences</h2>
                </div>
                <div className="account-details">
                  <ThemePreference />
                  <PalettePreference />
                </div>
                <div className="sub-header dark-shade">
                  <h2>Actions</h2>
                </div>
                <div className="account-details">
                  <DeleteAccountAction />
                </div>
              </Fragment>
            )}
          </div>
          <div className="social-tab" tabIndex={1} hidden={activeTab !== 1}>
            <div className="social-container">
              <div className="sub-header dark-shade">
                <h2>Social</h2>
              </div>
              <AppBar position="static" sx={{ marginTop: "0 !important" }}>
                <Tabs
                  value={activeSocialTab}
                  onChange={(_e, v) => setActiveSocialTab(v)}
                  variant="fullWidth"
                >
                  <Tab value={0} label="Followers" />
                  <Tab value={1} label="Following" />
                </Tabs>
              </AppBar>
              {isLoading ? (
                <Loader />
              ) : (activeSocialTab === 0 && followers.length === 0) ||
                (activeSocialTab === 1 && following.length === 0) ? (
                <div className="empty">
                  No {activeSocialTab === 0 ? "Followers" : "Followed Users"}
                </div>
              ) : (
                <Fragment>
                  <div
                    className="followers-tab"
                    tabIndex={0}
                    hidden={activeSocialTab !== 0}
                  >
                    <div className="followers">
                      {followers.map((follower) => {
                        return (
                          <div
                            className="follower"
                            key={follower.userId}
                            onClick={() =>
                              navigate(`/view-user/${follower.userId}`, {
                                state: {
                                  userId: follower.userId,
                                },
                              })
                            }
                          >
                            <Avatar
                              sx={{
                                bgcolor: "var(--palette-colour)",
                                height: 50,
                                width: 50,
                              }}
                            />
                            <div className="details">
                              <div className="text-xl truncate">
                                {follower.name}
                              </div>
                              <div className="text-xs text-[gray] truncate">
                                Followed You:{" "}
                                {format(follower.followedOn, "do MMMM yyyy")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div
                        className={`flex justify-center items-center p-6 ${
                          followers.length === user.totalFollowers && "hidden"
                        }`}
                      >
                        <CustomTooltip title="Load more" arrow>
                          <span>
                            <Fab
                              disabled={
                                followers?.length === user.totalFollowers
                              }
                              onClick={() => FetchSocial()}
                            >
                              <AddIcon />
                            </Fab>
                          </span>
                        </CustomTooltip>
                      </div>
                    </div>
                  </div>
                  <div
                    className="following-tab"
                    tabIndex={1}
                    hidden={activeSocialTab !== 1}
                  >
                    <div className="followers">
                      {following.map((follower) => {
                        return (
                          <div
                            className="follower"
                            key={follower.userId}
                            onClick={() =>
                              navigate(`/view-user/${follower.userId}`, {
                                state: {
                                  userId: follower.userId,
                                },
                              })
                            }
                          >
                            <Avatar
                              sx={{
                                bgcolor: "var(--palette-colour)",
                                height: 50,
                                width: 50,
                              }}
                            />
                            <div className="details">
                              <div className="text-xl truncate">
                                {follower.name}
                              </div>
                              <div className="text-xs text-[gray] truncate">
                                You Followed:{" "}
                                {format(follower.followedOn, "do MMMM yyyy")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="reviews-tab" tabIndex={2} hidden={activeTab !== 2}>
            <div className="reviews-container">
              <div className="sub-header dark-shade">
                <h2>Reviews</h2>
                <div className="actions">
                  <ToggleButtonGroup
                    value={selectedReviewFilter}
                    onChange={(e, v) => {
                      e.stopPropagation();
                      if (v !== null) setSelectedReviewFilter(v);
                      else
                        setSelectedReviewFilter((prev) =>
                          prev.filter((f) => f !== v)
                        );
                    }}
                  >
                    <ToggleButton value={MediaType.Movie}>
                      <CustomTooltip title="Movies" arrow>
                        <MovieIcon />
                      </CustomTooltip>
                    </ToggleButton>
                    <ToggleButton value={MediaType.Series}>
                      <CustomTooltip title="Series" arrow>
                        <SeriesIcon />
                      </CustomTooltip>
                    </ToggleButton>
                    <ToggleButton value={MediaType.Game}>
                      <CustomTooltip title="Games" arrow>
                        <GameIcon />
                      </CustomTooltip>
                    </ToggleButton>
                    <ToggleButton value={MediaType.Episode}>
                      <CustomTooltip title="Episodes" arrow>
                        <EpisodeIcon />
                      </CustomTooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="layout">
                  {filteredReviews(reviews, selectedReviewFilter).length ===
                  0 ? (
                    <div className="reviews">
                      <div className="empty">No Reviews</div>
                    </div>
                  ) : (
                    <div className="reviews">
                      {filteredReviews(reviews, selectedReviewFilter).map(
                        (review) => {
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
                                <CardMedia component="div" />
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
                        }
                      )}
                      <div
                        className={`flex justify-center items-center p-6 ${
                          reviews.length === user.totalReviews && "hidden"
                        }`}
                      >
                        <CustomTooltip title="All reviewed media loaded" arrow>
                          <span>
                            <Fab
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
                  {!reviewsBreakdown.every((value) => value === 0) && (
                    <Fragment>
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
                    </Fragment>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="backlog-tab" tabIndex={3} hidden={activeTab !== 3}>
            <div className="backlog-container">
              <div className="sub-header dark-shade">
                <h2>Backlog</h2>
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
          <div className="milestones-tab" tabIndex={4} hidden={activeTab !== 4}>
            <div className="milestones-container">
              <div className="sub-header dark-shade">
                <h2>Milestones</h2>
              </div>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="layout">
                  <MilestonesAccordion
                    category={milestones.at(0)?.category!}
                    milestones={milestones.at(0)?.milestones!}
                    isPalette={true}
                  />
                  <MilestonesAccordion
                    category={milestones.at(1)?.category!}
                    milestones={milestones.at(1)?.milestones!}
                    isPalette={true}
                  />
                  <MilestonesAccordion
                    category={milestones.at(2)?.category!}
                    milestones={milestones.at(2)?.milestones!}
                    isPalette={true}
                  />
                  <MilestonesAccordion
                    category={milestones.at(3)?.category!}
                    milestones={milestones.at(3)?.milestones!}
                    isPalette={true}
                  />
                  <MilestonesAccordion
                    category={milestones.at(4)?.category!}
                    milestones={milestones.at(4)?.milestones!}
                    isPalette={true}
                  />
                  <MilestonesAccordion
                    category={milestones.at(5)?.category!}
                    milestones={milestones.at(5)?.milestones!}
                    isPalette={true}
                  />
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
