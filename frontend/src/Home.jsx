import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

export function Home() {
  const [movies, setMovies] = useState([]);  // Stan na przechowywanie listy filmów
  const [loading, setLoading] = useState(true); // Stan na kontrolowanie ładowania danych
  const [error, setError] = useState(null); // Stan na błędy
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  console.log(API_BASE_URL);

  // Fetch data when the component is mounted
  useEffect(() => {
    // Funkcja do pobrania danych z API
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movies`); // Upewnij się, że API działa na tym porcie
        if (!response.ok) {
          throw new Error('Nie udało się pobrać filmów');
        }
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []); // Zależności są puste, więc ta funkcja wykona się tylko raz przy montowaniu komponentu

  // Renderowanie stanu ładowania, błędów lub listy filmów
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

  return (
    <Container>
      <h1 className="my-4 text-center">Filmy</h1>
      <Row>
        {movies.map((movie) => (
          <Col key={movie.ID} xs={12} md={6} lg={4}>
            <Card className="mb-4">
                <Card.Img variant="top" src={`${API_BASE_URL}/image/${movie.imageURL}`} alt={movie.title} height="600px;" style={{ objectFit: 'cover' }}/>
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Link to={`/movie/${movie.ID}`}>
                    <Card.Text>
                      <small>Kliknij tutaj aby zobaczyć szczegóły</small>
                    </Card.Text>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
