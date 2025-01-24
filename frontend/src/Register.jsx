import { useState } from "react";
import { cognitoSignUp } from "./cognito";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="register">
      <div className="register-form">
        <h1>Register</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ username, email, password });
            cognitoSignUp(email, username, password)
              .then((result) => {
                console.log(result);
                window.alert("Registered successfully");
              })
              .catch((error) => window.alert(error.message));
          }}
        >
          <label htmlFor="username">Username:</label>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <label htmlFor="password">Password:</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">Register</button>
        </form>
        <button className="back-to-login-btn" onClick={() => console.log("backToLogin")}>
          Back to login
        </button>
      </div>
    </div>
  );
}
