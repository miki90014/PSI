import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Alert, Card, Button, ListGroup } from 'react-bootstrap';  // Importowanie komponentów Bootstrap

function CinemaManagement() {
  const [cinemas, setCinemas] = useState([]);  // Stan przechowujący listę kin
  const [loading, setLoading] = useState(true); // Stan kontrolujący ładowanie
  const [error, setError] = useState(null); // Stan na błędy
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL; // URL do backendu, wczytywane z pliku .env

  // Funkcja do pobrania danych o kinach
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cinemas`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać kin');
        }
        const data = await response.json();
        setCinemas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []); // Funkcja wykona się tylko raz po załadowaniu komponentu

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
      <h1 className="mb-4">Zarządzanie Kinami</h1>
      <ListGroup>
        {cinemas.map((cinema) => (
          <ListGroup.Item key={cinema.ID}>
            <Card>
              <Card.Body>
                <Card.Title>{cinema.name}</Card.Title>
                <Card.Text>{cinema.address}</Card.Text>
                <Link to={`/cinema/${cinema.ID}`} className="btn btn-primary">
                  Zobacz szczegóły
                </Link>
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CinemaManagement;
