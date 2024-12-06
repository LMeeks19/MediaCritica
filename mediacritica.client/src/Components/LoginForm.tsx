import "./LoginForm.scss";

function LoginForm(props: LoginFormProps) {
  return (
    <form className="login-form">
      <div className="login-title">{props.formTitle}</div>
      <div className="login-input">
        <label className="login-label" htmlFor="email">
          Email:
        </label>
        <input
          className="login-email"
          type="email"
          id="email"
          name="email"
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
          id="password"
          name="password"
          required
        />
      </div>
      <button className="login-button" type="submit">
        {props.buttonText}
      </button>
    </form>
  );
}

export default LoginForm;

interface LoginFormProps {
  formTitle: string;
  buttonText: string;
}
