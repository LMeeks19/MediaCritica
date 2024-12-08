import { AppBar, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TopBar from "../Components/TopBar";
import LoginForm from "../Components/LoginForm";
import { LoginFormType } from "../Enums/LoginFormType";

import TabPanel from "../Components/TabPanel";
import "./LoginPage.scss";

function LoginPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="loginpage-container">
      <TopBar hideAccount />
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

export default LoginPage;
