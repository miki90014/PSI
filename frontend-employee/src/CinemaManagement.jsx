import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CinemaManagement() {
  console.log("Starting app")
  const [cinemas, setCinemas] = useState([]);  // Stan przechowujący listę kin
  const [loading, setLoading] = useState(true); // Stan kontrolujący ładowanie
  const [error, setError] = useState(null); // Stan na błędy
  const API_BASE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL; // URL do backendu, wczytywane z pliku .env
  console.log(API_BASE_URL)
  // Funkcja do pobrania danych o kinach
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cinemas`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać kin');
        }
        const data = await response.json();
        console.log(data)
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
    <div className="cinemas-container">
      <h1 className="page-title">Zarządzanie Kinami</h1>
      <ul className="cinemas-list">
        {cinemas.map((cinema) => (
          <li key={cinema.ID} className="cinema-item">
            <h3>{cinema.name}</h3>
            <p>{cinema.address}</p>
            {/* Link do szczegółów kina */}
            <Link to={`/cinema/${cinema.ID}`} className="details-link">
              Zobacz szczegóły
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CinemaManagement;
