import "./ViewUserPage.scss";
import TopBar from "../Components/TopBar";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CustomTooltip } from "../Components/Tooltip";
import { useState } from "react";
import { format } from "date-fns";

function ViewUserPage() {
  const [isFollowed, setIsFollowed] = useState<boolean>(true);

  return (
    <div className="viewuserpage-container">
      <div className="viewuser">
        <TopBar whiteText />
        <div className="header">
          <div className="flex flex-col">
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
        <div className="user"></div>
      </div>
    </div>
  );
}

export default ViewUserPage;
