import React from "react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
const API_BASE_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
const API_BASE_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;

async function fetchReservations(clientId) {
  const response = await fetch(`${API_BASE_CUSTOMER_URL}/reservation/${clientId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }
  const data = await response.json();
  return data;
}

export function TicketsView() {
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const today = new Date().toISOString().slice(0, 10);
  useEffect(() => {
    const clientId = 2;
    fetchReservations(clientId).then((data) => {
      setReservations(data.filter((reservation) => reservation.showingDetails.date >= today));
      setTransactions(data.filter((reservation) => reservation.showingDetails.date < today));
    });
  }, []);
  const listOfReservations = reservations.map((reservation) => (
    <div className="reservation" key={reservation.id}>
      <div className="movie-poster-div">
        <img className="movie-poster" src={`${API_BASE_EMPLOYEE_URL}/image/${reservation.movie.imageURL}`} alt={reservation.movie.title} />
      </div>
      <div className="reservation-info">
        <p className="movie-title">{reservation.movie.title}</p>
        <p className="movie-date">{reservation.showingDetails.date}</p>
        <p className="movie-hour">{reservation.showingDetails.hour}</p>
        <p className="movie-hall">Sala: {reservation.hall}</p>
        {reservation.seats.map((seat) => (
          <>
            <p className="movie-row">Rząd: {seat.row}</p>
            <p className="movie-seats">Miejsce: {seat.seat}</p>
          </>
        ))}
        <p className="movie-price">Suma: {reservation.price} zł</p>
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
    <div className="reservation" key={transaction.id}>
      <div className="movie-poster-div">
        <img className="movie-poster" src={`${API_BASE_EMPLOYEE_URL}/image/${transaction.movie.imageURL}`} alt={transaction.movie.title} />
      </div>
      <div className="reservation-info">
        <p className="movie-title">{transaction.movie.title}</p>
        <p className="movie-date">{transaction.showingDetails.date}</p>
        <p className="movie-hour">{transaction.showingDetails.hour}</p>
        <p className="movie-hall">Sala: {transaction.hall}</p>
        {transaction.seats.map((seat) => (
          <>
            <p className="movie-row">Rząd: {seat.row}</p>
            <p className="movie-seats">Miejsce: {seat.seat}</p>
          </>
        ))}
        <p className="movie-price">Suma: {transaction.price} zł</p>
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
