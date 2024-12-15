import { AppBar, Tabs, Tab } from "@mui/material";
import { LoginFormType } from "../Enums/LoginFormType";
import LoginForm from "./LoginForm";
import TabPanel from "./TabPanel";
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
          <Tab label="CREATE ACCOUNT" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <LoginForm FormType={LoginFormType.Login} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <LoginForm FormType={LoginFormType.CreateAccount} />
        </TabPanel>
      </AppBar>
    </div>
  );
}

export default AccountLogin;
