import { FormEvent, useState } from "react";
import { LoginFormType } from "../Enums/LoginFormType";
import { GetUser, PostUser } from "../Server/Server";
import { useSetRecoilState } from "recoil";
import { userState } from "../State/GlobalState";
import { UserModel } from "../Interfaces/UserModel";
import "./LoginForm.scss";

function LoginForm(props: LoginFormProps) {
  const [forename, setForename] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassowrd, setConfirmPassword] = useState<string>("");
  const setUser = useSetRecoilState(userState);

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
        forename: forename,
        surname: surname,
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
      {props.FormType === LoginFormType.CreateAccount && (
        <div className="login-field">
          <label className="login-label" htmlFor="forename">
            Forename:
          </label>
          <input
            className="login-input"
            type="text"
            name="forename"
            value={forename}
            onChange={(e) => setForename(e.target.value)}
            required
          />
        </div>
      )}
      {props.FormType === LoginFormType.CreateAccount && (
        <div className="login-field">
          <label className="login-label" htmlFor="surname">
            Surname:
          </label>
          <input
            className="login-input"
            type="text"
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
      )}
      <div className="login-field">
        <label className="login-label" htmlFor="email">
          Email:
        </label>
        <input
          className="login-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="login-field">
        <label className="login-label" htmlFor="password">
          Password:
        </label>
        <input
          className="login-input"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {props.FormType === LoginFormType.CreateAccount && (
        <div className="login-field">
          <label className="login-label" htmlFor="confirm_password">
            Confirm Password:
          </label>
          <input
            className="login-input"
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
