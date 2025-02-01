import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RoomForm({ isEditMode = false }) {
  const { cinemaId, roomId } = useParams(); // Pobranie cinemaId i roomId z URL
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;
  const [room, setRoom] = useState({
    name: '',
    number: '',
    total_seats: '',
  });
  const navigate = useNavigate(); // Przekierowanie po zapisaniu

  useEffect(() => {
    if (isEditMode && roomId) {
      const fetchRoomData = async () => {
        try {
          // Fetch room data based on cinemaId and roomId
          const response = await fetch(`${API_BASE_URL}/cinema/room/${roomId}`);
          if (!response.ok) {
            throw new Error('Nie udało się pobrać danych sali');
          }
          const roomData = await response.json();
          setRoom({
            name: roomData.name,
            number: roomData.number,
            total_seats: roomData.total_seats, // Liczba miejsc tylko do odczytu
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchRoomData();
    }
  }, [cinemaId, roomId, isEditMode]); // Trigger the fetch when cinemaId or roomId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Edycja sali
      const response = await fetch(`${API_BASE_URL}/cinema/room/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
      });

      if (response.ok) {
        navigate(`/cinema/${cinemaId}`); // Powrót do strony szczegółów kina
      } else {
        alert('Błąd przy edycji sali');
      }
    } else {
      // Dodanie nowej sali
      const response = await fetch(`${API_BASE_URL}/cinema/${cinemaId}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
      });

      if (response.ok) {
        navigate(`/cinema/${cinemaId}`); // Powrót do strony szczegółów kina
      } else {
        alert('Błąd przy dodawaniu sali');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nazwa sali:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={room.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="number">Numer sali:</label>
        <input
          type="number"
          id="number"
          name="number"
          value={room.number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="total_seats">Liczba miejsc:</label>
        <input
          type="number"
          id="total_seats"
          name="total_seats"
          value={room.total_seats}
          onChange={handleChange}
          disabled={isEditMode} // Zablokowane w trybie edycji
          required
        />
      </div>
      <button type="submit">{isEditMode ? 'Zapisz zmiany' : 'Dodaj salę'}</button>
    </form>
  );
}

export default RoomForm;
