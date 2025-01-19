export function ReservationsView() {
  return (
    <div className="reservations-view-side">
      <div className="nav-bar">
        <a href="/client">Strona główna</a>
        <a href="/client">Repertuar</a>
        <a href="/client">Nasze kina</a>
        <a className="active" href="/client/login/reservations">
          Bilety
        </a>
        <a href="/client/login/userdata">Moje konto</a>
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
