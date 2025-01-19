import React from "react";
import { Link } from "react-router";

export function ReservationsView() {
  return (
    <div className="reservations-view-side">
      <div className="nav-bar">
        <Link to="/client">Strona główna</Link>
        <Link to="/client">Repertuar</Link>
        <Link to="/client">Nasze kina</Link>
        <Link className="active" to="/client/login/reservations">
          Bilety
        </Link>
        <Link to="/client/login/userdata">Moje konto</Link>
      </div>
      <div className="reservations-view">
        <h3>Twoje rezerwacje</h3>
        <div className="reservations">
          <div className="reservation">
            <div className="reservation-info">
              <h4>Film</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
