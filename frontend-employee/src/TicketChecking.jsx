import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';  // Importujemy komponenty Bootstrap

function TicketChecking() {
  const [ticketCode, setTicketCode] = useState('');
  const [message, setMessage] = useState(null);
  const [cinemaName, setCinemaName] = useState(null);
  const [cinemaAddress, setCinemaAddress] = useState(null); 
  const [movieName, setMovieName] = useState(null); 
  const [showingDate, setShowingDate] = useState(null); 
  const [roomNumber, setRoomNumber] = useState(null); 
  const [roomName, setRoomName] = useState(null); 
  const [seatsDetails, setSeatsDetails] = useState(null); 
  const API_BASE_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;
  const API_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;

  const checkTicket = async () => {
    setMessage(null);

    if (!ticketCode.trim()) {
      setMessage({ type: 'error', text: 'Wpisz kod biletu!' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/check_ticket/${ticketCode}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        // console.log(data)
        const { ticket_id, showing_date, room_id, movie_id, seats } = data;
        console.log(seats)

        // Ustaw szczegóły biletu
        setShowingDate(showing_date);
        setSeatsDetails(seats);

        // Pobierz szczegóły kina
        const cinemaResponse = await fetch(`${API_EMPLOYEE_URL}/cinema/${room_id}`);
        const cinemaData = await cinemaResponse.json();
        setCinemaName(cinemaData.name);
        setCinemaAddress(cinemaData.address)

        // Pobierz szczegóły filmu
        const movieResponse = await fetch(`${API_EMPLOYEE_URL}/movie/${movie_id}`);
        const movieData = await movieResponse.json();
        setMovieName(movieData.title);

        // Pobierz szczegóły sali
        const roomResponse = await fetch(`${API_EMPLOYEE_URL}/room/${room_id}`);
        const roomData = await roomResponse.json();
        setRoomNumber(roomData.number);
        setRoomName(roomData.name);

        // Ustaw komunikat o sukcesie
        setMessage({ type: 'success', text: `Bilet poprawnie zweryfikowany` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Bilet jest nieważny lub nie istnieje.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd serwera. Spróbuj ponownie.' });
    }
  };

  return (
    <div className="ticket-checking-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">Sprawdzanie Biletów</h2>

      <Form>
        <Form.Group controlId="ticketCode">
          <Form.Label>Wpisz kod biletu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz kod biletu"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={checkTicket} block>
          Sprawdź bilet
        </Button>
      </Form>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="mt-3">
          {message.text}
        </Alert>
      )}

      {/* Jeśli bilet jest poprawny, wyświetlamy szczegóły  */}
      {message && message.type === 'success' && (
        <div className="ticket-details mt-4 p-4 border rounded shadow-sm bg-light">
            <h3 className="mb-3">Bilet</h3>
            <div className="mb-3">
            <p><strong>Kino:</strong> {cinemaName} {cinemaAddress}</p>
            </div>
            <div className="mb-3">
            <p><strong>Film:</strong> {movieName}</p>
            </div>
            <div className="mb-3">
            <p><strong>Data seansu:</strong> {showingDate}</p>
            </div>
            <div className="mb-3">
            <p><strong>Numer sali:</strong> {roomNumber}</p>
            </div>
            <div className="mb-3">
            <p><strong>Nazwa sali:</strong> {roomName}</p>
            </div>

            <h4 className="mb-3">Lista miejsc:</h4>
            <ul className="list-group">
            {seatsDetails && seatsDetails.map((seat, index) => (
                <li key={index} className="list-group-item">Miejsce: {seat[1]} {seat[2]}</li>
            ))}
            </ul>
        </div>
        )}

    </div>
  );
}

export default TicketChecking;
