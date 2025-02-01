import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

function CinemaDetails() {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null); // Stan przechowujący szczegóły kina
  const [rooms, setRooms] = useState([]); // Stan przechowujący listę sal kinowych
  const [loading, setLoading] = useState(true); // Stan kontrolujący ładowanie
  const [error, setError] = useState(null); // Stan na błędy
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL; // URL do backendu, wczytywane z pliku .env
  console.log(API_BASE_URL)
  console.log(id)

  // Fetching cinema and rooms data when component is mounted
  useEffect(() => {
    const fetchCinemaDetails = async () => {
      try {
        // Fetch cinema details
        console.log(id)
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
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Renderowanie błędów
  if (error) {
    return (
      <div className="error-container">
        <h2>Błąd</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="cinema-details-container">
      {cinema && (
        <>
          <h1 className="cinema-title">{cinema.name}</h1>
          <p className="cinema-address">{cinema.address}</p>

          <Link to={`/cinema/${id}/room/add`} className="add-room-button">
            Dodaj salę
          </Link>

          <h2>Sale kinowe</h2>
          <ul className="rooms-list">
            {rooms.map((room) => (
              <li key={room.ID} className="room-item">
                <h3>{room.number}</h3>
                <h3>{room.name}</h3>
                <p>{room.total_seats} miejsc</p>
                <Link to={`/cinema/${id}/room/${room.ID}/edit`} className="edit-room-button">
                Edytuj
                </Link>
              </li>
            ))}
          </ul> 
        </>
      )}
    </div>
  );
}

export default CinemaDetails;
