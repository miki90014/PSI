import React from "react";
import { Link } from "react-router";

export function TicketsView() {
  let reservations = [1, 2];
  let transactions = [1, 2, 3];
  const listOfReservations = reservations.map((reservation) => (
    <div className="reservation" key={reservation}>
      <div className="movie-poster-div">
        <img className="movie-poster" src="https://fwcdn.pl/fpo/53/51/595351/7662231_1.3.jpg" alt="Paddington (2014)" />
      </div>
      <div className="reservation-info">
        <p className="movie-title">Paddington</p>
        <p className="movie-date">2021-12-12</p>
        <p className="movie-hour">12:00</p>
        <p className="movie-hall">Sala 5</p>
        <p className="movie-row">Rząd 13</p>
        <p className="movie-seats">Miejsca: 1, 2, 3</p>
        <p className="movie-price">Suma: 20 zł</p>
      </div>
      <div className="reservation-buttons">
        <button type="button" className="pay-button">
          Opłać
        </button>
        <button type="button" className="cancel-button">
          Anuluj
        </button>
      </div>
    </div>
  ));

  const listOfTransactions = transactions.map((transaction) => (
    <div className="reservation" key={transaction}>
      <div className="movie-poster-div">
        <img className="movie-poster" src="https://fwcdn.pl/fpo/53/51/595351/7662231_1.3.jpg" alt="Paddington (2014)" />
      </div>
      <div className="reservation-info">
        <p className="movie-title">Paddington</p>
        <p className="movie-date">2021-12-12</p>
        <p className="movie-hour">12:00</p>
        <p className="movie-hall">Sala 5</p>
        <p className="movie-row">Rząd 13</p>
        <p className="movie-seats">Miejsca: 1, 2, 3</p>
        <p className="movie-price">Suma: 20 zł</p>
      </div>
      <div className="reservation-buttons">
        <button type="button" className="cancel-button">
          Anuluj
        </button>
      </div>
    </div>
  ));
  return (
    <div className="tickets-view-side">
      <div className="nav-bar">
        <Link to="/client">Strona główna</Link>
        <Link to="/client">Repertuar</Link>
        <Link to="/client">Nasze kina</Link>
        <Link className="active" to="/client/login/reservations">
          Bilety
        </Link>
        <Link to="/client/login/userdata">Moje konto</Link>
      </div>
      <div className="tickets-view">
        <div className="reservations">
          <h3>Rezerwacje</h3>
          <div className="reservations-list">{listOfReservations}</div>
        </div>
        <div className="transactions-history">
          <h3>Historia zakupów</h3>
          <div className="transactions-list">{listOfTransactions}</div>
        </div>
      </div>
    </div>
  );
}
