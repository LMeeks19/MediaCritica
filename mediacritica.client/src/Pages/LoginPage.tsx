import "./LoginPage.scss";
import { AppBar, Tabs, Tab } from "@mui/material";
import { LoginFormType } from "../Enums/LoginFormType";
import LoginForm from "../Components/LoginForm";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { notificationsState, userState } from "../State/GlobalState";
import { UserModel } from "../Interfaces/UserModel";
import { resetThemePalette } from "../Helpers/ThemePaletteHelper";
import TopBar from "../Components/TopBar";

function LoginPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const setUser = useSetRecoilState(userState);
  const setNotificationsObject = useSetRecoilState(notificationsState);

  useEffect(() => {
    resetThemePalette();
    setUser({} as UserModel);
    setNotificationsObject([]);
  }, []);

  return (
    <div className="login-container">
      <TopBar />
      <AppBar className="login" position="static">
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          variant="fullWidth"
          centered
        >
          <Tab label="LOGIN" />
          <Tab label="SIGNUP" />
        </Tabs>
        <div tabIndex={0} hidden={activeTab !== 0}>
          <LoginForm FormType={LoginFormType.Login} />
        </div>
        <div tabIndex={1} hidden={activeTab !== 1}>
          <LoginForm FormType={LoginFormType.CreateAccount} />
        </div>
      </AppBar>
    </div>
  );
}

export default LoginPage;
