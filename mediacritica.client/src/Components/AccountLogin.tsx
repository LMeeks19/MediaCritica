import { AppBar, Tabs, Tab } from "@mui/material";
import { LoginFormType } from "../Enums/LoginFormType";
import LoginForm from "./LoginForm";
import { useState } from "react";
import "./AccountLogin.scss";

function AccountLogin() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="login-container">
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

export default AccountLogin;
