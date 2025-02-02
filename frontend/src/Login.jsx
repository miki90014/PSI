import { useState } from "react";
import { cognitoLogin } from "./cognito";
import { useNavigate, Link } from "react-router";

export function Login({ setAccessToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <div className="nav-bar">
        <ul>
          <li>
            <Link to="/client">Strona główna</Link>
          </li>
          <li>
            <Link to="/client">Repertuar</Link>
          </li>
          <li>
            <Link to="/client">Nasze kina</Link>
          </li>
          <li>
            <Link className="active" to="/client/login/reservations">
              Bilety
            </Link>
          </li>
          <li>
            <Link to="/client/login/userdata">Moje konto</Link>
          </li>
        </ul>
      </div>
      <div className="login-page">
        <div className="login-form">
          <h1>Logowanie</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log({ username, password });
              cognitoLogin(username, password)
                .then((result) => {
                  console.log(result);
                  if (result.cognitoGroup !== "customer") {
                    window.alert("You are not authorized to access this page");
                    return;
                  }
                  setAccessToken(result.accessToken);
                  navigate("/client/login/userdata");
                })
                .catch((error) => window.alert(error.message));
            }}
          >
            <label htmlFor="username">Nazwa użytkownika</label>
            <input type="text" placeholder="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="password">Hasło</label>
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <div className="login-buttons">
              <button type="submit">Zaloguj</button>
              <button type="button" className="register-btn" onClick={() => navigate("/client/register")}>
                Rejestracja
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
