import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

function NavBar() {
  const navigate = useNavigate();
  const userGroup = localStorage.getItem('userGroup');

  const handleLogout = () => {
    localStorage.removeItem('userGroup');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">CinemaApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {userGroup === 'network-admin' && (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to="/attendance">Analiza Frekwencji</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/cinema-management">Zarządzanie Kinami</Nav.Link>
                </Nav.Item>
              </>
            )}

            {userGroup === 'cinema-admin' && (
              <Nav.Item>
                <Nav.Link as={Link} to="/film-management">Zarządzanie Seansami</Nav.Link>
              </Nav.Item>
            )}

            {userGroup === 'employee' && (
              <Nav.Item>
                <Nav.Link as={Link} to="/tickets">Sprawdzanie Biletów</Nav.Link>
              </Nav.Item>
            )}

            <Nav.Item>
              <Nav.Link onClick={handleLogout}>Wyloguj</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
