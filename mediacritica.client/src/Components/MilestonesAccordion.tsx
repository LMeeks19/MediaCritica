import "./MilestonesAccordion.scss";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import { UserMilestoneLevel } from "../Enums/UserMilestoneLevel";
import { UserMilestoneType } from "../Enums/UserMilestoneType";
import GameIcon from "@mui/icons-material/SportsEsportsOutlined";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import SeriesIcon from "@mui/icons-material/LiveTvOutlined";
import EpisodeIcon from "@mui/icons-material/SubscriptionsOutlined";
import ReviewsWrittenIcon from "@mui/icons-material/ArticleOutlined";
import BackloggedmediaIcon from "@mui/icons-material/LibraryBooksOutlined";
import FinishedMediaIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import GenreIcon from "@mui/icons-material/TheaterComedyOutlined";
import CalendarIcon from "@mui/icons-material/CalendarMonthOutlined";
import ActivityStreakIcon from "@mui/icons-material/WhatshotOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDownOutlined";
import FollowersGainedIcon from "@mui/icons-material/GroupAddOutlined";
import UsersFollowedIcon from "@mui/icons-material/PeopleOutlined";

const MilestonesAccordion = (props: UserMilestoneModelObject) => {
  function GetLevelColour(level: UserMilestoneLevel) {
    switch (level) {
      case UserMilestoneLevel.Platinum:
        return "platinum";
      case UserMilestoneLevel.Gold:
        return "gold";
      case UserMilestoneLevel.Silver:
        return "silver";
      case UserMilestoneLevel.Bronze:
        return "bronze";
      default:
        return "";
    }
  }

  function GetIcon(type: UserMilestoneType) {
    switch (type) {
      case UserMilestoneType.MoviesReviewed:
        return <MovieIcon />;

      case UserMilestoneType.SeriesReviewed:
        return <SeriesIcon />;

      case UserMilestoneType.GamesReviewed:
        return <GameIcon />;

      case UserMilestoneType.EpisodesReviewed:
        return <EpisodeIcon />;

      case UserMilestoneType.BacklogAdded:
        return <BackloggedmediaIcon />;

      case UserMilestoneType.FinishedMedia:
        return <FinishedMediaIcon />;

      case UserMilestoneType.GenreVariety:
      case UserMilestoneType.SingleGenreReviewed:
        return <GenreIcon />;

      case UserMilestoneType.ActorVariety:
      case UserMilestoneType.DirectorVariety:
        return <PeopleIcon />;

      case UserMilestoneType.SingleActorReviewed:
      case UserMilestoneType.SingleDirectorReviewed:
        return <PersonIcon />;

      case UserMilestoneType.MonthlyReviews:
      case UserMilestoneType.YearlyReviews:
        return <CalendarIcon />;

      case UserMilestoneType.ConsecutiveActivity:
        return <ActivityStreakIcon />;

      case UserMilestoneType.ReviewEngagementsGiven:
      case UserMilestoneType.TotalReviewEngagementsRecieved:
      case UserMilestoneType.Engagements50PerReview:
        return <ThumbsUpDownIcon />;

      case UserMilestoneType.Followers:
        return <FollowersGainedIcon />;

      case UserMilestoneType.Following:
        return <UsersFollowedIcon />;

      default:
        return <ReviewsWrittenIcon />;
    }
  }

  return (
    <Accordion
      className="accordion"
      disableGutters
      defaultExpanded={props?.milestones?.length > 0}
    >
      <AccordionSummary
        className={`sub-header ${props.isPalette ? "palette" : "dark-shade"}`}
        expandIcon={<ArrowDropDownIcon />}
      >
        <h2>{props?.category}</h2>
      </AccordionSummary>
      {props?.milestones?.length === 0 ? (
        <AccordionDetails className="milestones empty">
          No {props.category}
        </AccordionDetails>
      ) : (
        <AccordionDetails className="milestones">
          {props?.milestones?.map((milestone) => {
            return (
              <div
                key={milestone.type}
                className={`milestone ${GetLevelColour(milestone.earnedLevel)}`}
              >
                <div className="icon">{GetIcon(milestone.type)}</div>
                <div className="details">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                  {milestone.earnedDate && (
                    <p>Earned: {milestone.earnedDate}</p>
                  )}
                  {milestone.progress && (
                    <div className="progress">
                      <div className="bar">
                        <div
                          className="track"
                          style={{
                            width: `${milestone.progress.percentage}%`,
                          }}
                        ></div>
                      </div>
                      <span className="label">
                        {milestone.progress.current}/{milestone.progress.target}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </AccordionDetails>
      )}
    </Accordion>
  );
};

export default MilestonesAccordion;
