import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cognitoLogin } from "./cognito";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ username, password });
    cognitoLogin(username, password)
      .then((result) => {
        console.log(result);
        // if (result.cognitoGroup == "customer") {
        //  window.alert("You are not authorized to access this page");
        //   return;
        // }
        //setAccessToken(result.accessToken);
        navigate("/home");
      })
      .catch((error) => window.alert(error.message));
  };

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default Login;
