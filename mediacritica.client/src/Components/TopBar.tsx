import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faHouse,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      {props.showReturn && (
        <IconButton className="button return" onClick={() => history.back()}>
          <FontAwesomeIcon className="icon" icon={faChevronCircleLeft} />
        </IconButton>
      )}
      {!props.hideHome && (
        <IconButton className="button home" onClick={() => navigate("/")}>
          <FontAwesomeIcon className="icon" icon={faHouse} />
        </IconButton>
      )}
      {!props.hideAccount && (
        <IconButton
          className="button account"
          onClick={() => navigate("/account")}
        >
          <FontAwesomeIcon className="icon" icon={faUserCircle} />
        </IconButton>
      )}
    </div>
  );
}

export default TopBar;

interface TopBarProps {
  showReturn?: boolean;
  hideHome?: boolean;
  hideAccount?: boolean;
}
