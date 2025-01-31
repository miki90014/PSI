import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { cognitoChangePassword, cognitoChangeUserAttributes, cognitoGetUserData } from "./cognito";
import "./UserData.css";

export function UserData({ accessToken }) {
  const [names, setNames] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (accessToken) {
      cognitoGetUserData(accessToken).then((result) => {
        console.log(result);
        let name = "";
        let email = "";
        result.UserAttributes.forEach((attr) => {
          if (attr.Name === "name") {
            name = attr.Value;
          }
          if (attr.Name === "email") {
            email = attr.Value;
          }
        });
        setNames(name);
        setUsername(result.Username);
        setEmail(email);
      });
    }
  }, [accessToken]);
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
      <div className="user-data-page">
        <div className="user-data-form">
          <h3>Dane osobowe</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditing(false);
              console.log({
                names,
                email,
                password,
                newPassword,
                confirmNewPassword,
              });
              if (email) {
                cognitoChangeUserAttributes(accessToken, email, names).then((result) => {
                  console.log(result);
                });
              }
              if (password && newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
                cognitoChangePassword(accessToken, password, newPassword).then((result) => {
                  console.log(result);
                });
              }
              setPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
            }}
          >
            <label htmlFor="names">Imię i nazwisko</label>
            {isEditing ? (
              <>
                <br />
                <input type="text" value={names} onChange={(e) => setNames(e.target.value)}></input>
              </>
            ) : (
              <p>{names}</p>
            )}
            <label htmlFor="username">Nazwa użytkownika</label>
            <p>{username}</p>
            <label htmlFor="email">Email</label>
            {isEditing ? (
              <>
                <br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <br />
              </>
            ) : (
              <p>{email}</p>
            )}
            <label htmlFor="password">{isEditing ? "Stare hasło" : "Hasło"}</label>
            {isEditing ? (
              <>
                <br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input> <br />
              </>
            ) : (
              <p>********</p>
            )}
            {isEditing ? (
              <>
                <label htmlFor="newPassword">Nowe hasło</label>
                <>
                  <br />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
                  <br />
                </>
                <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
                <>
                  <br />
                  <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}></input>
                  <br />
                </>
              </>
            ) : null}
            <div className="buttons">
              {isEditing ? <button type="submit">Zapisz</button> : null}
              {!isEditing ? (
                <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edytuj
                </button>
              ) : null}
              {isEditing ? (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                >
                  Anuluj
                </button>
              ) : null}{" "}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
