import { AppBar, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import TopBar from "../Components/TopBar";
import LoginForm from "../Components/LoginForm";
import "../Style/LoginPage.scss";

function LoginPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return (
      <div role="tabpanel" className="login-tab" hidden={value !== index}>
        {value === index && children}
      </div>
    );
  }

  return (
    <div className="loginpage-container">
      <TopBar isLoginPage={true} />
      <AppBar className="login" position="static">
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="fullWidth"
          centered
        >
          <Tab label="LOGIN" />
          <Tab label="CREATE ACCOUNT" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <LoginForm formTitle="LOGIN" buttonText="Login" />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <LoginForm formTitle="CREATE ACCOUNT" buttonText="Create Account" />
        </TabPanel>
      </AppBar>
    </div>
  );
}

export default LoginPage;
