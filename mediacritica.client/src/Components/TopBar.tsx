import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="return">
        {!props.isHomePage && (
          <div className="text" onClick={() => history.back()}>
            MEDIA CRITICA
          </div>
        )}
      </div>
      <div className={`account ${!props.isMediaPage && "blank"}`}>
        {!props.isLoginPage && (
          <div
            className="text"
            onClick={() =>
              navigate(user.Email === undefined ? "/login" : "/account")
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
  isMediaPage?: boolean;
  isHomePage?: boolean;
  isLoginPage?: boolean;
}
