import TopBar from "../Components/TopBar";
import { useRecoilValue } from "recoil";
import { userState } from "../State/GlobalState";
import AccountLogin from "../Components/AccountLogin";
import "./AccountPage.scss";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

function AccountPage() {
  const user = useRecoilValue(userState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    function GetAccount() {
      setIsLoading(true);
      setIsLoading(false);
    }
    GetAccount();
  }, []);

  return (
    <div className="accountpage-container">
      {isLoading ? (
        <div className="loader">
          <BeatLoader
            speedMultiplier={0.5}
            color="rgba(151, 18, 18, 1)"
            size={20}
          />
        </div>
      ) : (
        <>
          <TopBar hideAccount />
          {user.email === null ? (
            <AccountLogin />
          ) : (
            <div className="account">Account Page</div>
          )}
        </>
      )}
    </div>
  );
}

export default AccountPage;
