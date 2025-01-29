import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Hook do pobrania parametrów URL
import { Container, Row, Col, Spinner, Alert, Card, Form } from 'react-bootstrap';

export function MovieDetails() {
  const { id } = useParams();  // Pobieramy ID filmu z URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movie/${id}`);
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
    return <div>No movie found</div>;
  }

  return (
    <Container>
      <Row className="my-4">
        {/* Obrazek po lewej stronie */}
        <Col md={3}>
          <Card.Img
            variant="top"
            src={`http://localhost:5000/image/${movie.imageURL}`}
            alt={movie.title}
            style={{ width: '200px', height: '500px;', objectFit: 'cover' }}
          />
        </Col>

        {/* Szczegóły filmu po prawej stronie */}
        <Col md={8}>
          <h1>{movie.title}</h1>
          <p><strong>Duration:</strong> {movie.duration} min</p>
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Cast:</strong> {movie.cast}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={3}>
          <h4>Subscriptions</h4>
          <p>You like this kind of movie? <br></br> Subsribe to be up to date!</p>
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
                <Card.Title>Available Showtimes (Coming soon)</Card.Title>
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
