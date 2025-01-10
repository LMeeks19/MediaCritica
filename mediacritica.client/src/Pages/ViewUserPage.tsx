import "./ViewUserPage.scss";
import TopBar from "../Components/TopBar";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CustomTooltip } from "../Components/Tooltip";
import { useState } from "react";
import { format } from "date-fns";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import millify from "millify";
import { BarChart } from "@mui/x-charts/BarChart";

function ViewUserPage() {
  const [isFollowed, setIsFollowed] = useState<boolean>(true);

  const starRatings: any[] = [];

  for (let i = 0; i <= 5; i += 0.5) {
    if (i === 1) starRatings.push(`${i} Star`);
    else starRatings.push(`${i} Stars`);
  }

  return (
    <div className="viewuserpage-container">
      <div className="viewuser">
        <TopBar whiteText />
        <div className="header">
          <div className="flex flex-col gap-1">
            <h1>Placeholder Name</h1>
            <span>Joined: {format(new Date(), "do MMMM yyyy")}</span>
          </div>
          <div className="actions">
            <CustomTooltip title={isFollowed ? "Unfollow user" : "Follow user"}>
              <span>
                <IconButton onClick={() => setIsFollowed(!isFollowed)}>
                  {isFollowed ? <PersonRemoveIcon /> : <PersonAddIcon />}
                </IconButton>
              </span>
            </CustomTooltip>
          </div>
        </div>
        <div className="user">
          <div className="section">
            <div className="sub-header dark-shade">
              <h2>Stats</h2>
            </div>
            <div className="summary-content">
              <div className="summary-card">
                <h3>Reviews Written</h3>
                <span>{millify(747, { precision: 1, lowercase: true })}</span>
              </div>
              <div className="summary-card">
                <h3>Media Backlogged</h3>
                <span>{millify(50, { precision: 1, lowercase: true })}</span>
              </div>
              <div className="summary-card">
                <h3>Followers</h3>
                <span>{millify(1100, { precision: 1, lowercase: true })}</span>
              </div>
              <div className="summary-card">
                <h3>Followers</h3>
                <span>{millify(295, { precision: 1, lowercase: true })}</span>
              </div>
              <div className="summary-card">
                <h3>Engagements Received</h3>
                <div className="flex justify-evenly w-full">
                  <span>
                    <ThumbUpIcon />
                    {millify(50500, { precision: 1, lowercase: true })}
                  </span>
                  <span>
                    <ThumbDownIcon />{" "}
                    {millify(2200, { precision: 1, lowercase: true })}
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <h3>Engagements Given</h3>
                <div className="flex justify-evenly w-full">
                  <span>
                    <ThumbUpIcon />{" "}
                    {millify(371, { precision: 1, lowercase: true })}
                  </span>
                  <span>
                    <ThumbDownIcon />{" "}
                    {millify(99, { precision: 1, lowercase: true })}
                  </span>
                </div>
              </div>
              <div className="summary-card">
                <h3>Milestones Earned</h3>
                <span>{millify(17, { precision: 1, lowercase: true })}</span>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="sub-header dark-shade">
              <h2>Recent Activity</h2>
            </div>
            <div className="content"></div>
          </div>
          <div className="section">
            <div className="sub-header dark-shade">
              <h2>Rating Breakdown</h2>
            </div>
            <div className="rating-breakdown-content">
              <BarChart
                colors={["var(--palette-colour)"]}
                height={450}
                margin={{ top: 30, left: 40, right: 10 }}
                borderRadius={8}
                series={[
                  {
                    data: [10, 19, 33, 23, 55, 76, 32, 83, 67, 54, 42],
                  },
                ]}
                xAxis={[
                  {
                    data: starRatings,
                    scaleType: "band",
                  },
                ]}
              ></BarChart>
            </div>
          </div>
          <div className="section">
            <div className="sub-header dark-shade">
              <h2>Milestones</h2>
            </div>
            <div className="content"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUserPage;
