import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import NavBar from './NavBar';
import Login from './Login';
import Attendance from './Attendance';  // Analiza Frekwencji
import CinemaManagement from './CinemaManagement';  // Zarządzanie Kinami
import FilmManagement from './FilmManagement';  // Zarządzanie Seansami
import TicketChecking from './TicketChecking';  // Sprawdzanie Biletów
import CinemaDetails from './CinemaDetails';
import RoomForm from './RoomForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Strona logowania (jeśli potrzebujesz logowania, dodaj ją tutaj) */}
        <Route path="/" element={<Login />} />
        
        {/* Strona główna po zalogowaniu */}
        <Route path="/home" element={<Home />} />

        {/* Strona z NavBar */}
        <Route path="/attendance" element={<><NavBar /><Attendance /></>} />
        <Route path="/cinema-management" element={<><NavBar /><CinemaManagement /></>} />
        <Route path="/film-management" element={<><NavBar /><FilmManagement /></>} />
        <Route path="/tickets" element={<><NavBar /><TicketChecking /></>} />
        <Route path="/cinema/:id" element={<CinemaDetails />} />
        <Route path="/cinema/:cinemaId/room/add" element={<RoomForm isEditMode={false} />} />
        <Route path="/cinema/:cinemaId/room/:roomId/edit" element={<RoomForm isEditMode={true} />} />

      </Routes>
    </Router>
  );
}

export default App;
