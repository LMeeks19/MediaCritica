import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import { UserMilestoneModelObject } from "../Interfaces/UserMilestoneModel";
import { format } from "date-fns";
import { CapitaliseFirstLetter } from "../Helpers/StringHelper";

function MilestonesAccordion(props: { object: UserMilestoneModelObject }) {
  return (
    <Accordion disableGutters defaultExpanded>
      <AccordionSummary
        className="sub-header dark-shade"
        expandIcon={<ArrowDropDownIcon />}
      >
        <h2>{props.object.category}</h2>
      </AccordionSummary>
      <AccordionDetails className="milestones">
        {props.object.milestones.map((milestone) => {
          return (
            <div key={milestone.title} className={`milestone ${milestone.level || ""}`}>
              <div className="icon">{milestone.icon}</div>
              <div className="details">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                {milestone.earnedDate && (
                  <p>
                    {CapitaliseFirstLetter(milestone.level || "")} Earned:{" "}
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
                          width: `${
                            (milestone.progress.current /
                              milestone.progress.target) *
                            100
                          }%`,
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
