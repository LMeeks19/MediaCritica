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
import { GetViewUserSummary } from "../Server/Server";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";
import GradeIcon from "@mui/icons-material/Grade";
import ScrollContainer from "react-indiana-drag-scroll";
import MilestonesAccordion from "../Components/MilestonesAccordion";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function ViewUserPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [userSummary, setUserSummary] = useState<ViewUserSummaryModel>(
    {} as ViewUserSummaryModel
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function GetUserSummary() {
      setIsLoading(true);
      if (location.state.userId === undefined) navigate("/");
      const userSummaryData = await GetViewUserSummary(location.state.userId);
      setUserSummary(userSummaryData);
      setIsLoading(false);
    }
    GetUserSummary();
  }, []);

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
              <span>
                Joined:{" "}
                {format(userSummary.joined ?? new Date(), "do MMMM yyyy")}
              </span>
            </div>
            <div className="actions">
              <CustomTooltip
                title={isFollowed ? "Unfollow user" : "Follow user"}
              >
                <span>
                  <IconButton onClick={() => setIsFollowed(!isFollowed)}>
                    {isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
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
              defaultExpanded
            >
              <AccordionSummary
                className="sub-header dark-shade"
                expandIcon={<ArrowDropDownIcon />}
              >
                <h2>Recent Reviews</h2>
              </AccordionSummary>
              <AccordionDetails>
                <ScrollContainer className="recent-reviews-content">
                  {userSummary.reviews?.map((item) => {
                    return (
                      <Card key={item.id}>
                        <img
                          className="image"
                          src={item.mediaPoster?.replace("300.jpg", "180.jpg")}
                          alt={item.title}
                        />
                        <CardActionArea
                          onClick={() =>
                            navigate(`/media/${item.id}`, {
                              state: {
                                mediaId: item.id,
                                mediaType: item.mediaType,
                              },
                            })
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
              </AccordionDetails>
            </Accordion>
            <Accordion
              className="accordion section"
              disableGutters
              defaultExpanded
            >
              <AccordionSummary
                className="sub-header dark-shade"
                expandIcon={<ArrowDropDownIcon />}
              >
                <h2>Review Ratings Breakdown</h2>
              </AccordionSummary>
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
