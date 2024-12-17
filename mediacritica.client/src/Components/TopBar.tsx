import { useNavigate } from "react-router-dom";
import "./TopBar.scss";

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={`topbar ${!props.topbarColor && "blank"}`}
      style={{ backgroundColor: props.topbarColor }}
    >
      <div
        className="return"
        style={{ color: props.topbarColor && "whitesmoke" }}
      >
        {!props.hideReturn && (
          <div className="text" onClick={() => navigate("/")}>
            MEDIA CRITICA
          </div>
        )}
      </div>
      <div
        className="account"
        style={{ color: props.topbarColor && "whitesmoke" }}
      >
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
  topbarColor?: string;
  hideReturn?: boolean;
  hideAccount?: boolean;
}
