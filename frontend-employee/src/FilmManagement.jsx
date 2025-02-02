import React, { useState, useEffect } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom'; 

function FilmManagement() {
  const [showings, setShowings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  const API_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;
  const cinemaId = 1; // Ustawione ID kina na stałe

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cinema/${cinemaId}/rooms`);
        const roomsData = await response.json();
        setRooms(roomsData.map(room => room.ID)); // Pobieramy ID wszystkich sal w danym kinie
      } catch (error) {
        console.error('Błąd podczas pobierania sal:', error);
      }
    };

    const fetchShowings = async () => {
      try {
        const response = await fetch(`${API_CUSTOMER_URL}/showings`);
        let showingsData = await response.json();

        // Pobieranie szczegółowych informacji o filmach i salach
        const showingsWithDetails = await Promise.all(
          showingsData.map(async (showing) => {
            const movieResponse = await fetch(`${API_BASE_URL}/movie/${showing.MovieID}`);
            const movieData = await movieResponse.json();

            const roomResponse = await fetch(`${API_BASE_URL}/room/${showing.RoomID}`);
            const roomData = await roomResponse.json();

            return {
              ...showing,
              movieTitle: movieData.title || 'Nieznany tytuł',
              roomNumber: roomData.number || 'Brak danych',
              roomName: roomData.name || 'Brak danych',
            };
          })
        );

        setShowings(showingsWithDetails);
      } catch (error) {
        console.error('Błąd podczas pobierania seansów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms().then(fetchShowings);
  }, []);

  // 🔹 Filtrujemy seanse, które odbywają się tylko w dostępnych salach
  const filteredShowings = showings.filter(showing => rooms.includes(showing.RoomID));

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Zarządzanie Seansami</h2>
        <Link to={`/showing/add`}>
            <Button variant="success">Dodaj seans</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Ładowanie seansów...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Tytuł Filmu</th>
              <th>Data Rozpoczęcia</th>
              <th>Numer Sali</th>
              <th>Nazwa Sali</th>
            </tr>
          </thead>
          <tbody>
            {filteredShowings.length > 0 ? (
              filteredShowings.map((showing, index) => (
                <tr key={showing.ID}>
                  <td>{index + 1}</td>
                  <td>{showing.movieTitle}</td>
                  <td>{showing.Date}</td>
                  <td>{showing.roomNumber}</td>
                  <td>{showing.roomName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Brak dostępnych seansów</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default FilmManagement;
