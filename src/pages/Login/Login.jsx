import "./Login.css";
import assets from "../../assets/assets";
import { useState } from "react";
import { login, signup, resetPass } from "../../config/firebase";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign up") {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="login">
      <img className="logo" src={assets.logo_big} alt="logo_big_icon" />
      <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currentState}</h2>
        {currentState === "Sign up" ? (
          <input
            type="text"
            placeholder="username"
            className="form-input"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        ) : null}
        <input
          type="email"
          placeholder="Email address"
          className="form-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="form-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          {currentState === "Sign up" ? "Create account" : "Login now"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forget">
          <p className="login-toggle">
            {currentState === "Sign up"
              ? "Already have an account?"
              : "Don't have an account?"}
            &nbsp;&nbsp;
            <span
              onClick={() =>
                setCurrentState((prev) =>
                  prev === "Sign up" ? "Log in" : "Sign up"
                )
              }
            >
              {currentState === "Sign up" ? "Log in" : "Sign up"}
            </span>
          </p>
          {currentState === "Log in" ? (
            <p className="login-toggle">
              Forgot Password ? <span onClick={()=> resetPass(email)}>Reset here</span>
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
