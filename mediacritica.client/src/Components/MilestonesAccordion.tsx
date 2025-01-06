import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import { format } from "date-fns";
import { UserMilestoneLevelType } from "../Enums/UserMilestoneLevelType";

function MilestonesAccordion(props: { object: UserMilestoneModelObject }) {
  function GetLevelColour(level: UserMilestoneLevelType) {
    switch (level) {
      case UserMilestoneLevelType.Platinum:
        return "platinum";
      case UserMilestoneLevelType.Gold:
        return "gold";
      case UserMilestoneLevelType.Silver:
        return "silver";
      case UserMilestoneLevelType.Bronze:
        return "bronze";
      default:
        return "";
    }
  }

  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary
        className="sub-header dark-shade"
        expandIcon={<ArrowDropDownIcon />}
      >
        <h2>{props.object?.category}</h2>
      </AccordionSummary>
      <AccordionDetails className="milestones">
        {props.object?.milestones.map((milestone) => {
          return (
            <div
              key={milestone.title}
              className={`milestone ${GetLevelColour(milestone.earnedLevel)}`}
            >
              <div className="icon"></div>
              <div className="details">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                {milestone.earnedDate && (
                  <p>
                    Earned:{" "}
                    {milestone.earnedDate &&
                      format(milestone.earnedDate, "do MMMM yyyy")}
                  </p>
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
    </Accordion>
  );
}

export default MilestonesAccordion;
