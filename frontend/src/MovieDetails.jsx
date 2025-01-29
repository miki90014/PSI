import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Hook do pobrania parametrów URL
import { Container, Row, Col, Spinner, Alert, Card, Form } from 'react-bootstrap';

export function MovieDetails() {
  const { id } = useParams();  // Pobieramy ID filmu z URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  console.log(API_BASE_EMPLOYEE_URL);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_EMPLOYEE_URL}/movie/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);  // Zależność: kiedy ID się zmieni, zaktualizuje dane

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

  if (!movie) {
    return <div>Nie znaleziono filmu</div>;
  }

  return (
    <Container>
      <Row className="my-4">
        {/* Obrazek po lewej stronie */}
        <Col md={3}>
          <Card.Img
            variant="top"
            src={`${API_BASE_EMPLOYEE_URL}/image/${movie.imageURL}`}
            alt={movie.title}
            style={{ width: '200px', height: '500px;', objectFit: 'cover' }}
          />
        </Col>

        {/* Szczegóły filmu po prawej stronie */}
        <Col md={8}>
          <h1>{movie.title}</h1>
          <p><strong>Czas trwania:</strong> {movie.duration} min</p>
          <p><strong>Opis:</strong> {movie.description}</p>
          <p><strong>Obsada:</strong> {movie.cast}</p>
          <p><strong>Reżyser:</strong> {movie.director}</p>
          <p><strong>Gatunek:</strong> {movie.Genre}</p>
          <p><strong>Data premiery:</strong> {movie.release_date}</p>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={3}>
          <h4>Subskrypcje</h4>
          <p>Podoba ci się taki rodzaj filmu? <br></br> Zasubskrubyj aby być na bieżąco!</p>
          <Form>
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label={movie.cast}
            />
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label={movie.director}
            />
            <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label={movie.Genre}
            />
            {/* Disable if not logged
            <Form.Check // prettier-ignore
              disabled
              type="switch"
              label="disabled switch"
              id="disabled-custom-switch"
            />*/}
          </Form>
        </Col>
        <Col md={8}>
            <Card className="mb-4">
            <Card.Body>
                <Card.Title>Dostępne seanse (Coming soon)</Card.Title>
                    <Card.Text>
                      <small>Click to view details</small>
                    </Card.Text>
              </Card.Body>
            </Card>
          {/* Możesz tu później dodać listę dostępnych seansów */}
        </Col>
      </Row>
    </Container>
  );
}
