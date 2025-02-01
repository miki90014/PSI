import { useState } from "react";
import { cognitoSignUp } from "./cognito";
import { useNavigate, Link } from "react-router";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

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
      <div className="register-page">
        <div className="register-form">
          <h1>Rejestracja</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log({ username, email, password });
              cognitoSignUp(email, username, password)
                .then((result) => {
                  console.log(result);
                  window.alert("Registered successfully");
                  navigation("/client/login");
                })
                .catch((error) => window.alert(error.message));
            }}
          >
            <label htmlFor="username">Nazwa użytkownika</label>
            <input type="text" placeholder="Nazwa użytkownika" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="email">Adres e-mail</label>
            <input type="email" placeholder="Adres e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <label htmlFor="password">Hasło</label>
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <div className="register-buttons">
              <button type="submit">Zarejestruj</button>
              <button type="button" className="back-to-login-btn" onClick={() => navigation("/client/login")}>
                Logowanie
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
