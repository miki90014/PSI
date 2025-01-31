import { useState } from "react";
import { cognitoLogin } from "./cognito";
import { useNavigate } from "react-router";

export function Login({ setAccessToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ username, password });
            cognitoLogin(username, password)
              .then((result) => {
                setAccessToken(result.AuthenticationResult.AccessToken);
                navigate("/client/login/userdata");
              })
              .catch((error) => window.alert(error.message));
          }}
        >
          <label htmlFor="username">Username:</label>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor="password">Password:</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">Login</button>
        </form>
        <button className="register-btn" onClick={() => navigate("/client/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
