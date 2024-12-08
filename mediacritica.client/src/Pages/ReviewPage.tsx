import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userState } from "../State/GlobalState";
import { useRecoilValue } from "recoil";
import "./ReviewPage.scss";
import TopBar from "../Components/TopBar";

function ReviewPage() {
  const user = useRecoilValue(userState);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (location.state?.mediaId === undefined || user.email === null) &&
      navigate("/");
  });

  return (
    <div className="reviewpage-container">
      <TopBar />
      <div>Review Page</div>
    </div>
  );
}

export default ReviewPage;
