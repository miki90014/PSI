import React, { useState } from "react";

export function UserData() {
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  return (
    <div className="user-data-page">
      <div className="nav-bar">
        <a href="/client">Strona główna</a>
        <a href="/client">Repertuar</a>
        <a href="/client">Nasze kina</a>
        <a href="reservations">Bilety</a>
        <a className="active" href="/client/login/userdata">
          Moje konto
        </a>
      </div>
      <div className="user-data-form">
        <h3>Dane osobowe</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({
              names,
              email,
              password,
              newPassword,
              confirmNewPassword,
            });
          }}
        >
          <label htmlFor="names">Imię i nazwisko</label>
          <input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
          ></input>
          <br />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <br />
          <label htmlFor="password">Stare hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <br />
          <label htmlFor="newPassword">Nowe hasło</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></input>
          <br />
          <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          ></input>
          <br />
          <button type="submit">Zapisz</button>
        </form>
        <button className="cancel-btn" onClick={() => console.log("cancel")}>
          Anuluj
        </button>
      </div>
    </div>
  );
}
