import { useEffect } from "react";
import TopBar from "../Components/TopBar";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import "./AccountPage.scss";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    (user.email === null || user.email === undefined) && navigate("/login");
  }, []);

  return (
    <div className="accountpage-container">
      <TopBar hideAccount />
    </div>
  );
}

export default AccountPage;
