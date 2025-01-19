import { useState } from "react";
//import { cognitoLogin } from "./cognito";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ username, password });
            //cognitoLogin here
          }}
        >
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label htmlFor="password">Passowrd:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit" onClick={() => console.log("login")}>
            Login
          </button>
        </form>
        <button
          className="register-btn"
          onClick={() => console.log("register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
