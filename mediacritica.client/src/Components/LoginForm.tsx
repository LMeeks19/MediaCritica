import { FormEvent, useState } from "react";
import { LoginFormType } from "../Enums/LoginFormType";
import "./LoginForm.scss";
import { GetUser, PostUser } from "../Server/Server";
import { useSetRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../Interfaces/UserModel";

function LoginForm(props: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassowrd, setConfirmPassword] = useState<string>("");
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  function Submit(event: FormEvent) {
    event.preventDefault();
    props.FormType === LoginFormType.Login ? Login() : CreateAccount();
  }

  async function Login() {
    const userData = await GetUser(email);
    if (userData.password === password) {
      setUser(userData);
    }
  }

  async function CreateAccount() {
    if (password === confirmPassowrd) {
      const userData = await PostUser({
        email: email,
        password: password,
      } as UserModel);
      setUser(userData);
    }
  }

  return (
    <form className="login-form" onSubmit={(e) => Submit(e)}>
      <div className="login-title">
        {props.FormType === LoginFormType.Login
          ? LoginFormType.Login.toUpperCase()
          : LoginFormType.CreateAccount.toUpperCase()}
      </div>
      <div className="login-input">
        <label className="login-label" htmlFor="email">
          Email:
        </label>
        <input
          className="login-email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="login-input">
        <label className="login-label" htmlFor="password">
          Password:
        </label>
        <input
          className="login-password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {props.FormType === LoginFormType.CreateAccount && (
        <div className="login-input">
          <label className="login-label" htmlFor="password">
            Confirm Password:
          </label>
          <input
            className="login-password"
            type="password"
            name="confirm_password"
            value={confirmPassowrd}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}
      <button className="login-button" type="submit">
        {props.FormType === LoginFormType.Login
          ? LoginFormType.Login
          : LoginFormType.CreateAccount}
      </button>
    </form>
  );
}

export default LoginForm;

interface LoginFormProps {
  FormType: LoginFormType;
}
