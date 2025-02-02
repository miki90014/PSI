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
import ShowingForm from './ShowingForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/attendance" element={<><NavBar /><Attendance /></>} />
        <Route path="/cinema-management" element={<><NavBar /><CinemaManagement /></>} />
        <Route path="/film-management" element={<><NavBar /><FilmManagement /></>} />
        <Route path="/showing/add" element={<><NavBar /><ShowingForm /></>} />
        <Route path="/tickets" element={<><NavBar /><TicketChecking /></>} />
        <Route path="/cinema/:id" element={<><NavBar /><CinemaDetails /></>} />
        <Route path="/cinema/:cinemaId/room/add" element={<><NavBar /><RoomForm isEditMode={false} /></>} />
        <Route path="/cinema/:cinemaId/room/:roomId/edit" element={<><NavBar /><RoomForm isEditMode={true} /></>} />

      </Routes>
    </Router>
  );
}

export default App;
