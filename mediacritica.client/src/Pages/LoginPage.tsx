import "./LoginPage.scss";
import {
  AppBar,
  Tabs,
  Tab,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UserModel } from "../Interfaces/UserModel";
import TopBar from "../Components/TopBar";
import {
  areCookiesEnabled,
  storeAuthToken,
} from "../Helpers/AuthenticationHelper";
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
    console.log(userObject);
    if (userObject.user !== null) {
      setUser(userObject.user);
      if (userObject.authToken !== null) storeAuthToken(userObject.authToken);
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

  return (
    <Fragment>
      <TopBar />

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
            <form onSubmit={(e) => LoginUser(e)}>
              <div className="login-title">LOGIN</div>
              <TextField
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <FormControlLabel
                sx={{ gap: "0.5rem", marginRight: "auto" }}
                control={
                  <Checkbox
                    sx={{ color: "whitesmoke" }}
                    value={rememberMe}
                    onChange={() => setRememebrMe((prev) => !prev)}
                    disabled={!areCookiesEnabled()}
                  />
                }
                label="Remember Me"
              />
              <Button type="submit">Login</Button>
            </form>
          </div>
          <div tabIndex={1} hidden={activeTab !== 1}>
            <form onSubmit={(e) => CreateAccount(e)}>
              <div className="login-title">Create Account</div>
              <TextField
                type="text"
                name="forename"
                label="Forename"
                value={forename}
                onChange={(e) => setForename(e.target.value)}
              />
              <TextField
                type="text"
                name="surname"
                label="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />

              <TextField
                type="email"
                name="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                type="password"
                name="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                type="password"
                name="confirm_password"
                label="Confirm Password"
                value={confirmPassowrd}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit">Create Account</Button>
            </form>
          </div>
        </AppBar>
      </div>
    </Fragment>
  );
}

export default LoginPage;
