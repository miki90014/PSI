import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Card, Button  } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export function MovieReservation() {
    const location = useLocation();

    const { showID } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [room, setRoom] = useState(null);
    const [availableSeats, setAvaialbleSeats] = useState(null);
    const [seats, setSeats] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]); // Stan dla wybranych miejsc

    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');
    const price = queryParams.get('price');
    const form = queryParams.get('form');
    const title = queryParams.get('movieTitle');
    const roomID = queryParams.get('roomID');
    const cinemaName = queryParams.get('cinemaName');
    const imageURL = queryParams.get('imageURL');

    const API_BASE_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
    const API_BASE_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;

    useEffect(() => {
        const fetchShowDetails = async () => {
          try {
            const response_room = await fetch(`${API_BASE_EMPLOYEE_URL}/room/${roomID}`);
            if (!response_room.ok) {
              throw new Error('Failed to fetch room details');
            }
            const data_room = await response_room.json();
            setRoom(data_room);

            const response_seats = await fetch(`${API_BASE_EMPLOYEE_URL}/seats/${roomID}`);
            if (!response_seats.ok) {
              throw new Error('Failed to fetch seats details');
            }
            const data_seats = await response_seats.json();
            setSeats(data_seats);
            
            
            const response_available_seats = await fetch(`${API_BASE_CUSTOMER_URL}/available_seats/${showID}`);
            if (!response_available_seats.ok) {
              throw new Error('Failed to fetch available seats details');
            }
            const data_available_seats = await response_available_seats.json();
            setAvaialbleSeats(data_available_seats); 

          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchShowDetails();
      }, [showID]);
    if (loading) {
      return (
        <Container className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </Container>
      );
    }

    if (error) {
      return (
        <Container>
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      );
    }

    // Mapowanie dostępnych miejsc do obiektu dla szybszego dostępu
    const seatAvailability = availableSeats.reduce((acc, seat) => {
      acc[seat.seatSeatID] = seat.available === "T"; // "T" oznacza dostępne miejsce
      return acc;
    }, {});
  
    // Obsługa kliknięcia miejsca
    const handleSeatClick = (seatID) => {
      if (!seatAvailability[seatID]) return; // Jeśli miejsce jest zajęte, nic nie rób
  
      setSelectedSeats((prevSelected) =>
        prevSelected.includes(seatID)
          ? prevSelected.filter((id) => id !== seatID) // Odznaczenie
          : [...prevSelected, seatID] // Zaznaczenie
      );
    };

    return (

        <Container>
            <h1 className="my-4 text-center">Rezerwacja filmu</h1>
          <Row className="bg-light p-4 rounded shadow">
            <Col md={3} >
              <Card.Img
                variant="top"
                src={`${API_BASE_EMPLOYEE_URL}/image/${imageURL}`}
                alt={title}
                style={{ width: '200px', height: '500px;', objectFit: 'cover' }}
              />
            </Col>
    
            <Col md={6}>
            <p><strong>Tytuł:</strong> {title}</p>
            <p><strong>Data:</strong> {date}</p>
            <p><strong>Cena za bilet:</strong> {price} PLN</p>
            <p><strong>Forma:</strong> {form}</p>
            <p><strong>Pokój:</strong> {room.name} {room.number}</p>
            <p><strong>Kino:</strong> {cinemaName}</p>
            </Col>
          </Row>
          <br></br>
          <Row className="bg-light p-4 rounded shadow">
            <Col md={2}>
                <div className="d-flex align-items-center mb-2">
                <Button variant="success" className="seat me-2" disabled></Button> 
                <span>Dostępne</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Button variant="danger" className="seat me-2" disabled></Button> 
                  <span>Zajęte</span>
                </div>
                <div className="d-flex align-items-center">
                  <Button variant="warning" className="seat me-2" disabled></Button> 
                  <span>Wybrane</span>
                </div>
            </Col>
            <Col md={6}>
                <h4 className="mb-3">Rezerwacja miejsc</h4>
                <div className="screen bg-dark text-light p-2 mb-3 rounded">🎬 Ekran</div>

                {Object.values(
                  seats.reduce((acc, seat) => {
                    if (!acc[seat.row]) acc[seat.row] = [];
                    acc[seat.row].push(seat);
                    return acc;
                  }, {})
                ).map((rowSeats, index) => (
                  <Row key={index} className="justify-content-center mb-2">
                    {rowSeats.map((seat) => {
                      const isAvailable = seatAvailability[seat.ID];
                      const isSelected = selectedSeats.includes(seat.ID);
                    
                      return (
                        <Col key={seat.ID} xs="auto" className="p-1">
                          <Button
                            variant={
                              isSelected
                                ? "warning"
                                : isAvailable
                                ? "success"
                                : "danger"
                            }
                            onClick={() => handleSeatClick(seat.ID)}
                            className="seat"
                            disabled={!isAvailable}
                          >
                            {seat.row}{seat.number}
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                ))}
            </Col>
            <Col md={2}>
            <h4 className="mb-3">Wybrane miejsca</h4>
              {selectedSeats.length > 0 && (
                  <div className="mt-3">
                    <strong>Miejsca:</strong>{" "}
                    {selectedSeats.map((seatID) => {
                      const seat = seats.find((s) => s.ID === seatID);
                      return `${seat.row}${seat.number} `;
                    })}
                    <br></br>
                    <strong>Całkowita cena:</strong> {selectedSeats.length * price} PLN
                  </div>
                )}
            </Col>
          </Row>

        </Container>
      );
}
