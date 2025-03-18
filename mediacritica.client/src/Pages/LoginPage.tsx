import "./LoginPage.scss";
import {
  Tabs,
  Tab,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UserModel } from "../Interfaces/UserModel";
import TopBar from "../Components/TopBar";
import { storeAuthToken } from "../Helpers/AuthenticationHelper";
import { useNavigate } from "react-router-dom";
import { UserLoginModel } from "../Interfaces/UserLoginModel";
import { Login, PostUser } from "../Server/Server";
import { setThemePalette } from "../Helpers/ThemePaletteHelper";

function LoginPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [user, setUser] = useRecoilState(userState);
  const [forename, setForename] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassowrd, setConfirmPassword] = useState<string>("");
  const [rememberMe, setRememebrMe] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id !== undefined) navigate("/account");
  }, [user]);

  async function LoginUser(event: FormEvent) {
    event.preventDefault();
    var userObject = await Login({
      email: email,
      password: password,
      rememberMe: rememberMe,
    } as UserLoginModel);
    if (userObject.user !== null && userObject.user !== undefined) {
      setUser(userObject.user);
      if (userObject.authToken !== null && userObject.authToken !== undefined)
        storeAuthToken(userObject.authToken);
      setThemePalette(userObject.user.preference);
      navigate("/account");
    }
  }

  async function CreateAccount(event: FormEvent) {
    event.preventDefault();
    if (password === confirmPassowrd) {
      await PostUser({
        forename: forename,
        surname: surname,
        email: email,
        password: password,
      } as UserModel);
      setActiveTab(0);
    }
  }

  const handleTabChange = (tabIndex: number) => {
    setForename("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRememebrMe(false);
    setActiveTab(tabIndex);
  };

  return (
    <div className="login-container">
      <TopBar hideBack />
      <div className="login">
        <div className="form-container">
          <Tabs
            value={activeTab}
            onChange={(_e, v) => handleTabChange(v)}
            variant="fullWidth"
            centered
          >
            <Tab label="Login" />
            <Tab label="Create Account" />
          </Tabs>
          <div className="content" tabIndex={0} hidden={activeTab !== 0}>
            <form className="login-form" onSubmit={(e) => LoginUser(e)}>
              <div className="title">LOGIN</div>
              <TextField
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <TextField
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <FormControlLabel
                sx={{ gap: "0.5rem", marginRight: "auto" }}
                control={
                  <Checkbox
                    sx={{ color: "whitesmoke" }}
                    value={rememberMe}
                    onChange={() => setRememebrMe((prev) => !prev)}
                    disabled={!navigator.cookieEnabled}
                  />
                }
                label="Remember Me"
              />
              <Button type="submit">Login</Button>
            </form>
          </div>
          <div className="content" tabIndex={1} hidden={activeTab !== 1}>
            <form className="create-form" onSubmit={(e) => CreateAccount(e)}>
              <div className="title">CREATE ACCOUNT</div>
              <TextField
                type="text"
                className="forename"
                name="forename"
                label="Forename"
                value={forename}
                onChange={(e) => setForename(e.target.value)}
                autoComplete="given-name"
                required
              />
              <TextField
                type="text"
                className="surname"
                name="surname"
                label="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                autoComplete="family-name"
                required
              />
              <TextField
                type="email"
                className="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <TextField
                type="password"
                className="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <TextField
                type="password"
                className="confirm_password"
                name="confirm_password"
                label="Confirm Password"
                value={confirmPassowrd}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <Button className="submit" type="submit">
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
