import React, { useState } from "react";
import { Link } from "react-router";

export function UserData() {
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="user-data-page">
      <div className="nav-bar">
        <Link to="/client">Strona główna</Link>
        <Link to="/client">Repertuar</Link>
        <Link to="/client">Nasze kina</Link>
        <Link to="/client/login/reservations">Bilety</Link>
        <Link className="active" to="/client/login/userdata">
          Moje konto
        </Link>
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
          {isEditing ? <input type="text" value={names} onChange={(e) => setNames(e.target.value)}></input> : <p>{names}</p>}
          <br />
          <label htmlFor="email">Email</label>
          {isEditing ? <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input> : <p>{email}</p>}
          <br />
          <label htmlFor="password">{isEditing ? "Stare hasło" : "Hasło"}</label>
          {isEditing ? <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input> : <p>********</p>}
          <br />
          {isEditing ? (
            <>
              <label htmlFor="newPassword">Nowe hasło</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
              <br />
              <label htmlFor="confirmNewPassword">Potwierdź nowe hasło</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}></input>
            </>
          ) : null}
          <br />
          {isEditing ? (
            <button type="submit">Zapisz</button>
          ) : (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
              Edytuj
            </button>
          )}
        </form>
        {isEditing ? (
          <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
            Anuluj
          </button>
        ) : null}
      </div>
    </div>
  );
}
