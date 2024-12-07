import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className={`return ${props.blankReturn && "blank"}`}>
        {!props.hideReturn && (
          <div className="text" onClick={() => navigate("/")}>
            MEDIA CRITICA
          </div>
        )}
      </div>
      <div className={`account ${props.blankAccount && "blank"}`}>
        {!props.hideAccount && (
          <div
            className="text"
            onClick={() =>
              navigate(user.email === null ? "/login" : "/account")
            }
          >
            ACCOUNT
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;

interface TopBarProps {
  hideReturn?: boolean;
  blankReturn?: boolean;
  hideAccount?: boolean;
  blankAccount?: boolean;
}
