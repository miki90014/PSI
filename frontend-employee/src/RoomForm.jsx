import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function RoomForm({ isEditMode = false }) {
  const { cinemaId, roomId } = useParams();
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  const [room, setRoom] = useState({
    name: '',
    number: '',
    total_seats: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode && roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/cinema/room/${roomId}`);
          if (!response.ok) {
            throw new Error('Nie udało się pobrać danych sali');
          }
          const roomData = await response.json();
          setRoom({
            name: roomData.name,
            number: roomData.number,
            total_seats: roomData.total_seats,
          });
        } catch (err) {
          setError('Nie udało się pobrać danych sali');
          console.error(err);
        }
      };
      fetchRoomData();
    }
  }, [cinemaId, roomId, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode) {
        // Edycja sali
        response = await fetch(`${API_BASE_URL}/cinema/room/${roomId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(room),
        });
      } else {
        // Dodanie nowej sali
        response = await fetch(`${API_BASE_URL}/cinema/${cinemaId}/room`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(room),
        });
      }

      if (response.ok) {
        navigate(`/cinema/${cinemaId}`);
      } else {
        setError('Błąd przy zapisywaniu sali');
      }
    } catch (err) {
      setError('Błąd przy zapisywaniu sali');
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h2>{isEditMode ? 'Edytuj salę' : 'Dodaj salę'}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Nazwa sali:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={room.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="number" className="mb-3">
              <Form.Label>Numer sali:</Form.Label>
              <Form.Control
                type="number"
                name="number"
                value={room.number}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="total_seats" className="mb-3">
              <Form.Label>Liczba miejsc:</Form.Label>
              <Form.Control
                type="number"
                name="total_seats"
                value={room.total_seats}
                onChange={handleChange}
                disabled={isEditMode}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" block>
              {isEditMode ? 'Zapisz zmiany' : 'Dodaj salę'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RoomForm;
