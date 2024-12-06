import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="return" onClick={() => history.back()}>
        <div className="text">MEDIA CRITICA</div>
      </div>
      <div className={`account ${props.accountBlank ? "blank" : ""}`}>
        <div
          className="text"
          onClick={() =>
            navigate(user.Email === undefined ? "/login" : "/account")
          }
        >
          {user.Email === undefined ? "SIGN IN" : "ACCOUNT"}
        </div>
      </div>
    </div>
  );
}

export default TopBar;

interface TopBarProps {
  accountBlank: boolean;
}
