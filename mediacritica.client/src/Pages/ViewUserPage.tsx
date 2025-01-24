import "./ViewUserPage.scss";
import TopBar from "../Components/TopBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CustomTooltip } from "../Components/Tooltip";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import millify from "millify";
import { BarChart } from "@mui/x-charts/BarChart";
import { ViewUserSummaryModel } from "../Interfaces/ViewUserSummaryModel";
import {
  FollowUser,
  GetUserFollow,
  GetViewUserSummary,
  ToggleUserFollowNotificationStatus,
  UnfollowUser,
} from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import GradeIcon from "@mui/icons-material/Grade";
import ScrollContainer from "react-indiana-drag-scroll";
import MilestonesAccordion from "../Components/MilestonesAccordion";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { UserFollowModel } from "../Interfaces/UserFollowModel";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Snackbar from "../Components/Snackbar";

function ViewUserPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState(true);
  const [userFollow, setUserFollow] = useState<UserFollowModel | null>(null);
  const [userSummary, setUserSummary] = useState<ViewUserSummaryModel>(
    {} as ViewUserSummaryModel
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function GetUserSummary() {
      if (location.state?.userId === undefined) navigate("/");
      setIsLoading(true);
      const userSummaryData = await GetViewUserSummary(location.state.userId);
      setUserSummary(userSummaryData);
      const userFollowData = await GetUserFollow(
        user.id ?? -1,
        location.state.userId
      );
      setUserFollow(userFollowData);
      setIsLoading(false);
    }
    GetUserSummary();
  }, []);

  async function ToggleFollow(isFollowed: boolean) {
    if (isFollowed) {
      var newUserFollow = {
        followerId: user.id,
        followedId: userSummary.id,
        followedOn: new Date(),
        enabledNotifications: false,
      } as UserFollowModel;
      const userFollowData = await FollowUser(newUserFollow);
      setUserFollow(userFollowData);
      setUserSummary({ ...userSummary, followers: userSummary.followers + 1 });
      Snackbar.Info(`Now following ${userSummary.name}`);
    } else {
      await UnfollowUser(userFollow!.id);
      setUserFollow(null);
      setUserSummary({ ...userSummary, followers: userSummary.followers - 1 });
      Snackbar.Info(`${userSummary.name} has been unfollowed`);
    }
  }

  async function ToggleNotifications() {
    const enabledNotifications = await ToggleUserFollowNotificationStatus(
      userFollow!.id
    );
    setUserFollow({
      ...userFollow!,
      enabledNotifications: enabledNotifications ?? false,
    });
    Snackbar.Info(
      `Notifications for ${userSummary.name} ${
        enabledNotifications ? "enabled" : "disabled"
      }`
    );
  }

  const starRatings: any[] = [];

  for (let i = 0; i <= 5; i += 0.5) {
    if (i === 1) starRatings.push(`${i} Star`);
    else starRatings.push(`${i} Stars`);
  }

  return (
    <div className="viewuserpage-container">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="viewuser">
          <TopBar whiteText />
          <div className="header">
            <div className="flex flex-col gap-1">
              <h1>{userSummary.name}</h1>
              <span>Joined: {format(userSummary.joined, "do MMMM yyyy")}</span>
            </div>
            <div className="actions">
              {userFollow !== null && user.id !== undefined && (
                <CustomTooltip
                  title={
                    userFollow?.enabledNotifications
                      ? "Disable notifications"
                      : "Enable notifications"
                  }
                >
                  <span>
                    <IconButton
                      onClick={() => ToggleNotifications()}
                      disabled={
                        user.id === undefined || user.id === userSummary.id
                      }
                    >
                      {userFollow?.enabledNotifications ? (
                        <NotificationsActiveIcon />
                      ) : (
                        <NotificationsNoneIcon />
                      )}
                    </IconButton>
                  </span>
                </CustomTooltip>
              )}
              <CustomTooltip
                title={
                  user.id === undefined
                    ? "Sign in to follow"
                    : user.id === userSummary.id
                    ? "Cannot follow self"
                    : userFollow !== null
                    ? "Unfollow user"
                    : "Follow user"
                }
              >
                <span>
                  <IconButton
                    onClick={() => ToggleFollow(userFollow === null)}
                    disabled={
                      user.id === undefined || user.id === userSummary.id
                    }
                  >
                    {userFollow !== null && user.id !== undefined ? (
                      <PersonRemoveIcon />
                    ) : (
                      <PersonAddIcon />
                    )}
                  </IconButton>
                </span>
              </CustomTooltip>
            </div>
          </div>
          <div className="user">
            <Accordion
              className="accordion section"
              disableGutters
              defaultExpanded
            >
              <AccordionSummary
                className="sub-header dark-shade"
                expandIcon={<ArrowDropDownIcon />}
              >
                <h2>Stats</h2>
              </AccordionSummary>
              <AccordionDetails className="summary-content">
                <div className="summary-card">
                  <h3>Reviews Written</h3>
                  <span>
                    {millify(userSummary.reviewsWritten ?? 0, {
                      precision: 1,
                      lowercase: true,
                    })}
                  </span>
                </div>
                <div className="summary-card">
                  <h3>Media Backlogged</h3>
                  <span>
                    {millify(userSummary.mediaBacklogged ?? 0, {
                      precision: 1,
                      lowercase: true,
                    })}
                  </span>
                </div>
                <div className="summary-card">
                  <h3>Followers</h3>
                  <span>
                    {millify(userSummary.followers ?? 0, {
                      precision: 1,
                      lowercase: true,
                    })}
                  </span>
                </div>
                <div className="summary-card">
                  <h3>Following</h3>
                  <span>
                    {millify(userSummary.following ?? 0, {
                      precision: 1,
                      lowercase: true,
                    })}
                  </span>
                </div>
                <div className="summary-card">
                  <h3>Engagements Received</h3>
                  <div className="flex justify-evenly w-full">
                    <span>
                      <ThumbUpIcon />
                      {millify(userSummary.engagementsReceivedLikes ?? 0, {
                        precision: 1,
                        lowercase: true,
                      })}
                    </span>
                    <span>
                      <ThumbDownIcon />{" "}
                      {millify(userSummary.engagementsReceivedDislikes ?? 0, {
                        precision: 1,
                        lowercase: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <h3>Engagements Given</h3>
                  <div className="flex justify-evenly w-full">
                    <span>
                      <ThumbUpIcon />{" "}
                      {millify(userSummary.engagementsGivenLikes ?? 0, {
                        precision: 1,
                        lowercase: true,
                      })}
                    </span>
                    <span>
                      <ThumbDownIcon />{" "}
                      {millify(userSummary.engagementsGivenDislikes ?? 0, {
                        precision: 1,
                        lowercase: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <h3>Milestones Earned</h3>
                  <span>
                    {millify(userSummary.milestonesEarned ?? 0, {
                      precision: 1,
                      lowercase: true,
                    })}
                  </span>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              className="accordion section"
              disableGutters
              defaultExpanded={userSummary.reviews?.length > 0}
            >
              <AccordionSummary
                className="sub-header dark-shade"
                expandIcon={<ArrowDropDownIcon />}
              >
                <h2>Recent Reviews</h2>
              </AccordionSummary>
              <AccordionDetails>
                {userSummary.reviews?.length === 0 ? (
                  <div className="recent-reviews-content empty">
                    No Recent Reviews
                  </div>
                ) : (
                  <ScrollContainer className="recent-reviews-content">
                    {userSummary.reviews?.map((item) => {
                      return (
                        <Card key={item.id}>
                          <img
                            className="image"
                            src={item.mediaPoster?.replace(
                              "300.jpg",
                              "180.jpg"
                            )}
                            alt={item.title}
                          />
                          <CardActionArea
                            onClick={() =>
                              navigate(
                                `/media/${item.mediaId}/view-review/${item.id}}`,
                                {
                                  state: {
                                    reviewId: item.id,
                                  },
                                }
                              )
                            }
                          >
                            <CardMedia component="div" />
                            <CardHeader title={item.title} />
                            <Divider />
                            <CardContent>
                              <Typography>{item.mediaTitle}</Typography>
                              <Typography>
                                {format(item.date, "do MMMM yyyy")}
                              </Typography>
                              <div className="flex justify-around">
                                <Typography>
                                  {CapitaliseFirstLetter(item.mediaType)}
                                </Typography>
                                {item.rating !== null && (
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
                                    <div className="">{item.rating}</div>
                                  </Typography>
                                )}
                              </div>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      );
                    })}
                  </ScrollContainer>
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion
              className="accordion section"
              disableGutters
              defaultExpanded={userSummary.breakdown.some(
                (value) => value !== 0
              )}
            >
              <AccordionSummary
                className="sub-header dark-shade"
                expandIcon={<ArrowDropDownIcon />}
              >
                <h2>Review Ratings Breakdown</h2>
              </AccordionSummary>
              {userSummary.breakdown.every((value) => value === 0) ? (
                <AccordionDetails className="rating-breakdown-content empty">
                  No Rating Breakdown
                </AccordionDetails>
              ) : (
                <AccordionDetails className="rating-breakdown-content">
                  <BarChart
                    colors={["var(--palette-colour)"]}
                    height={400}
                    margin={{ top: 30, left: 40, right: 10 }}
                    borderRadius={8}
                    series={[
                      {
                        data: userSummary.breakdown ?? [],
                      },
                    ]}
                    xAxis={[
                      {
                        data: starRatings,
                        scaleType: "band",
                      },
                    ]}
                  ></BarChart>
                </AccordionDetails>
              )}
            </Accordion>
            <div className="section">
              <MilestonesAccordion
                category="Recent Miestones"
                milestones={userSummary.milestones}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewUserPage;
