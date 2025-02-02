import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function ShowingForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');

  const navigate = useNavigate();

  const API_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  const API_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;
  const cinemaId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formatsRes, roomsRes, moviesRes, programsRes] = await Promise.all([
          fetch(`${API_CUSTOMER_URL}/forms`).then(res => res.json()),
          fetch(`${API_EMPLOYEE_URL}/cinema/${cinemaId}/rooms`).then(res => res.json()),
          fetch(`${API_EMPLOYEE_URL}/movies`).then(res => res.json()),
          fetch(`${API_EMPLOYEE_URL}/cinema/${cinemaId}/programs`).then(res => res.json()),
        ]);
        
        setFormats(formatsRes);
        setPrograms(programsRes);
        console.log()
        setRooms(roomsRes);
        setMovies(moviesRes);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seatsResponse = await fetch(`${API_EMPLOYEE_URL}/seats/${selectedRoom}`);
    const seatsData = await seatsResponse.json();
    console.log(seatsData)

    const showingData = {
      date: `${date} ${time}`,
      price,
      formatId: selectedFormat,
      programId: selectedProgram,
      roomId: selectedRoom,
      movieId: selectedMovie,
      seats: seatsData,
    };
    
    try {
      const response = await fetch(`${API_CUSTOMER_URL}/showing/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showingData),
      });
      
      if (response.ok) {
        navigate(`/film-management`);
      } else {
        alert('Błąd dodawania seansu.');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania danych:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Dodaj Seans</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="time">
              <Form.Label>Godzina</Form.Label>
              <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group controlId="price">
          <Form.Label>Cena biletu</Form.Label>
          <Form.Control type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="format">
          <Form.Label>Forma filmu</Form.Label>
          <Form.Control as="select" value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} required>
            <option value="">Wybierz format</option>
            {formats.map((format) => (
              <option key={format.ID} value={format.ID}>{format.movieFormName}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="program">
          <Form.Label>Program</Form.Label>
          <Form.Control as="select" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} required>
            <option value="">Wybierz program</option>
            {programs.map((program) => (
              <option key={program.ID} value={program.ID}>{new Date(program.start_date).toISOString().split('T')[0]} - {new Date(program.end_date).toISOString().split('T')[0]}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="room">
          <Form.Label>Sala</Form.Label>
          <Form.Control as="select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required>
            <option value="">Wybierz salę</option>
            {rooms.map((room) => (
              <option key={room.ID} value={room.ID}>{room.number} - {room.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="movie">
          <Form.Label>Film</Form.Label>
          <Form.Control as="select" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)} required>
            <option value="">Wybierz film</option>
            {movies.map((movie) => (
              <option key={movie.ID} value={movie.ID}>{movie.title}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">Dodaj Seans</Button>
      </Form>
    </Container>
  );
}

export default ShowingForm;
