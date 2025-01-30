import React from "react";
import { Link } from "react-router";

const reservations = [
  {
    id: 1,
    movie: {
      imageURL: "https://assets.upflix.pl/media/plakat/2017/paddington-2__300_427.jpg", //Reservation->AvailableSeats->Showing->Movie(nie istnieje)
      title: "Paddington 2",
    },
    showingDetails: {
      //Reservation/AvailableSeats/Showing
      date: "12213",
      hour: "123213",
    },
    hall: "5",
    seats: [
      {
        //Reservation/AvailableSeats/Seatseat
        row: "3",
        seat: "3",
      },
      {
        row: "3",
        seat: "4",
      },
    ],
    price: "29.00",
  },
];

const transactions = [
  {
    id: 1,
    movie: {
      imageURL: "https://fwcdn.pl/fpo/53/51/595351/7662231_1.3.jpg", //Reservation->AvailableSeats->Showing->Movie(nie istnieje)
      title: "Paddington",
    },
    showingDetails: {
      //Reservation/AvailableSeats/Showing
      date: "12213",
      hour: "123213",
    },
    hall: "5",
    seats: [
      {
        //Reservation/AvailableSeats/Seatseat
        row: "3",
        seat: "3",
      },
    ],
    price: "29.00",
  },
];

export function TicketsView() {
  const listOfReservations = reservations.map((reservation) => (
    <div className="reservation" key={reservation.id}>
      <div className="movie-poster-div">
        <img className="movie-poster" src={reservation.movie.imageURL} alt={reservation.movie.title} />
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
        <img className="movie-poster" src={transaction.movie.imageURL} alt={transaction.movie.title} />
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
