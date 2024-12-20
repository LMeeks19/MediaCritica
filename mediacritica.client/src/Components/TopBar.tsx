import { useNavigate } from "react-router-dom";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="return">
        {!props.hideReturn && (
          <div className="text" onClick={() => navigate("/")}>
            MEDIA CRITICA
          </div>
        )}
      </div>
      <div className="account">
        {!props.hideAccount && (
          <div className="text" onClick={() => navigate("/account")}>
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
  hideAccount?: boolean;
}
