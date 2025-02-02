import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { Spinner, Alert, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

function CinemaDetails() {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null); // Stan przechowujący szczegóły kina
  const [rooms, setRooms] = useState([]); // Stan przechowujący listę sal kinowych
  const [loading, setLoading] = useState(true); // Stan kontrolujący ładowanie
  const [error, setError] = useState(null); // Stan na błędy
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL; // URL do backendu, wczytywane z pliku .env

  // Fetching cinema and rooms data when component is mounted
  useEffect(() => {
    const fetchCinemaDetails = async () => {
      try {
        // Fetch cinema details
        const cinemaResponse = await fetch(`${API_BASE_URL}/cinema/${id}`);
        if (!cinemaResponse.ok) {
          throw new Error('Nie udało się pobrać szczegółów kina');
        }
        const cinemaData = await cinemaResponse.json();
        setCinema(cinemaData);

        // Fetch rooms for the cinema
        const roomsResponse = await fetch(`${API_BASE_URL}/cinema/${id}/rooms`);
        if (!roomsResponse.ok) {
          throw new Error('Nie udało się pobrać sal kinowych');
        }
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaDetails();
  }, [id]); // Trigger the fetch when the id changes

  // Renderowanie stanu ładowania
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Renderowanie błędów
  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          <h4>Błąd</h4>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {cinema && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{cinema.name}</Card.Title>
              <Card.Text>{cinema.address}</Card.Text>
              <Link to={`/cinema/${id}/room/add`}>
                <Button variant="success">Dodaj salę</Button>
              </Link>
            </Card.Body>
          </Card>

          <h2>Sale kinowe</h2>
          <ListGroup>
            {rooms.map((room) => (
              <ListGroupItem key={room.ID}>
                <Card>
                  <Card.Body>
                    <Card.Title>Numer: {room.number}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{room.name}</Card.Subtitle>
                    <Card.Text>{room.total_seats} miejsc</Card.Text>
                    <Link to={`/cinema/${id}/room/${room.ID}/edit`}>
                      <Button variant="warning">Edytuj</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      )}
    </div>
  );
}

export default CinemaDetails;
