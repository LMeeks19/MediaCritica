import "./TopBar.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faHouse,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  function DetermineNavigate() {
    return user.id === null || user.id === undefined
      ? navigate("/login")
      : navigate("/account");
  }

  return (
    <div className={`topbar ${props.whiteText ? "white-text" : ""}`}>
      {props.showReturn && (
        <IconButton className="button return" onClick={() => history.back()}>
          <FontAwesomeIcon className="icon" icon={faChevronCircleLeft} />
        </IconButton>
      )}
      {!props.hideHome ? (
        <IconButton className="button home" onClick={() => navigate("/")}>
          <FontAwesomeIcon className="icon" icon={faHouse} />
        </IconButton>
      ) : (
        <div className="title">MEDIA CRITICA</div>
      )}
      {!props.hideAccount && (
        <IconButton
          className="button account"
          onClick={() => DetermineNavigate()}
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
  whiteText?: boolean;
}
