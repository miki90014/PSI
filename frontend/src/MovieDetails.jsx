import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Hook do pobrania parametrów URL
import { Container, Row, Col, Spinner, Alert, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 

export function MovieDetails() {
  const { id } = useParams();  // Pobieramy ID filmu z URL
  const [movie, setMovie] = useState(null);
  const [cinemasAndPrograms, setCinemaAndProgram] = useState(null);
  const [movieShows, setMovieShows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  const API_BASE_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;
  console.log(API_BASE_EMPLOYEE_URL);

  const [selectedCinema, setSelectedCinema] = useState("");

  const handleCinemaChange = (event) => {
    setSelectedCinema(event.target.value);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response_movies = await fetch(`${API_BASE_EMPLOYEE_URL}/movie/${id}`);
        if (!response_movies.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data_movies = await response_movies.json();
        setMovie(data_movies);
        const response_cinema_and_programs = await fetch(`${API_BASE_EMPLOYEE_URL}/cinema/offers/${data_movies.OfferID}/programs`);
        if (!response_cinema_and_programs.ok) {
          throw new Error('Failed to fetch movie program details');
        }
        const data_cinemasAndPrograms = await response_cinema_and_programs.json();
        setCinemaAndProgram(data_cinemasAndPrograms);
        console.log(data_cinemasAndPrograms)
        let data_showings = [];

        await Promise.all(data_cinemasAndPrograms.map(async (cinema) => {
          const response_showing = await fetch(`${API_BASE_CUSTOMER_URL}/showing/program/${cinema.ProgramID}`);
          
          if (!response_showing.ok) {
            throw new Error('Failed to fetch movie program showings');
          }
      
          const data_showing = await response_showing.json();
          data_showings.push(data_showing);
        }));
        console.log("SHOWINGS", data_showings)
        setMovieShows(data_showings);           
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
                <Card.Title>Dostępne seanse</Card.Title>

                {/* Dropdown do wyboru kina */}
                <Form.Select value={selectedCinema} onChange={handleCinemaChange}>
                  <option value="">Wybierz kino</option>
                  {cinemasAndPrograms.map((cinema) => (
                    <option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </option>
                  ))}
                </Form.Select>
                  
                {selectedCinema && (
                  <ul className="mt-3">
                    {(() => {
                      // Znajdujemy ProgramID powiązane z selectedCinema
                      console.log(cinemasAndPrograms)
                      const selectedPrograms = cinemasAndPrograms
                      .filter((cinema) => cinema.name === selectedCinema);

                      console.log("selectedPrograms:", selectedPrograms);
                      console.log(typeof(selectedPrograms))
                      console.log("movieShows:", movieShows);
                      console.log(typeof(movieShows))
                    
                      // Filtrowanie movie_shows według ProgramID
                      const filteredShows = movieShows.filter((showArray) =>
                        showArray.some((show) => 
                          selectedPrograms.some((program) => program.ProgramID === show.ProgramID)
                        )
                      );
                      console.log("SHOWS!", filteredShows)

                      return filteredShows.length > 0 ? (
                        filteredShows.flat().map((show) => (
                          <li key={show.ShowID} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <span className="font-weight-bold">{show.Date}</span> - {show.Form} - <span className="text-success">{show.Price} PLN</span>
                            </div>
                            <Link to={
                                `/movie-reservation/${show.ShowID}?date=${show.Date}&price=${show.Price}&form=${show.Form}&movieTitle=${movie.title}&roomID=${show.RoomID}&cinemaName=${selectedCinema}&imageURL=${movie.imageURL}`
                              }>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-bookmark-plus"></i> Rezerwuj
                              </button>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <p className="text-muted">Brak dostępnych seansów</p>
                      );
                    })()}
                  </ul>
                )}
              </Card.Body>
            </Card>
          {/* Możesz tu później dodać listę dostępnych seansów */}
        </Col>
      </Row>
    </Container>
  );
}
