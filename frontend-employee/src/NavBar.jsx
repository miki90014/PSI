import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/attendance">Analiza Frekwencji</Link>
        </li>
        <li>
          <Link to="/cinema-management">Zarządzanie Kinami</Link>
        </li>
        <li>
          <Link to="/film-management">Zarządzanie Seansami</Link>
        </li>
        <li>
          <Link to="/tickets">Sprawdzanie Biletów</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
