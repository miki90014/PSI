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
        localStorage.setItem('userGroup', result.cognitoGroup);
        navigate("/home");
      })
      .catch((error) => window.alert(error.message));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Logowanie</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Zaloguj</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
