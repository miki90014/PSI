import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export function TicketSummary() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { reservationID } = useParams();
    const selectedSeatsNames = queryParams.get("selectedSeatsNames");
    const date = queryParams.get("date");
    const price = parseFloat(queryParams.get("price"));
    const form = queryParams.get("form");
    const title = queryParams.get("movieTitle");
    const cinemaName = queryParams.get("cinemaName");
    const email = queryParams.get("email");
    
    const [error, setError] = useState(null);    
    const [code, setCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_BASE_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;

    useEffect(() => {
      const fetchTicketCode = async () => {
        try {
          const response = await fetch(`${API_BASE_CUSTOMER_URL}/ticket_code/${reservationID}`);
          if (!response.ok) {
            throw new Error("Failed to fetch ticket code.");
          }
          const data = await response.json();
          setCode(data.code); // Załóżmy, że odpowiedź zawiera pole 'code'
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchTicketCode();
    }, [reservationID]); // Używamy tylko reservationID jako zależności

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
            <Alert.Heading>Błąd</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      );
    }

    const handleBackToHome = () => {
      navigate("/");  // Przekierowanie do strony głównej
    };
    
    const handleDownloadTicket = async (e) => {
      e.preventDefault(); // Zapobiegamy odświeżeniu strony
      
      try {
        // Wywołanie API do pobrania kodu QR
        const response = await fetch(`${API_BASE_CUSTOMER_URL}/download_code/${code}`, {
          method: "GET",
        });
    
        if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");
    
          link.href = URL.createObjectURL(blob);
          link.download = `${reservationID}.png`;
          link.click();
        } else {
          const data = await response.json();
          alert(`Błąd: ${data.message}`);
        }
      } catch (error) {
        alert("Wystąpił błąd podczas pobierania biletu.");
        console.error(error);
      }
    };

    const handleDownloadPDF = async () => {
      try {
        const response = await fetch(`${API_BASE_CUSTOMER_URL}/ticket_pdf/${code}/${title}`, {
          method: "GET",
        });

        if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");
    
          link.href = URL.createObjectURL(blob);
          link.download = `${reservationID}_ticket.pdf`;
          link.click();
        } else {
          const data = await response.json();
          alert(`Błąd: ${data.message}`);
        }
      } catch (error) {
        alert("Wystąpił błąd podczas pobierania PDF.");
        console.error(error);
      }
    };

    return (
      <Container>
      <div className="nav-bar">
        <ul>
          <li>
            <Link to="/client">Strona główna</Link>
          </li>
          <li>
            <Link to="/client">Repertuar</Link>
          </li>
          <li>
            <Link to="/client">Nasze kina</Link>
          </li>
          <li>
            <Link className="active" to="/client/login/reservations">
              Bilety
            </Link>
          </li>
          <li>
            <Link to="/client/login/userdata">Moje konto</Link>
          </li>
        </ul>
      </div>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card>
                <Card.Header as="h3" className="text-center">
                  Podsumowanie Rezerwacji
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Tytuł filmu:</strong> {title}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Forma Filmu:</strong> {form}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Kino:</strong> {cinemaName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Data seansu:</strong> {date}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Wybrane miejsca:</strong> {selectedSeatsNames}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Cena:</strong> {price} PLN
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
                <Card.Footer className="text-center">
                    <p>Wszystkie szczegóły zamówienia zostały wysłane na maila: {email}. Nie widzisz wiadomości?</p>
                    <p>Sprwadź folder spam!</p>
                    <div className="d-flex justify-content-between">
                      <Button variant="primary" onClick={handleDownloadPDF}>
                        Pobierz PDF
                      </Button>
                      <Button variant="primary" onClick={handleDownloadTicket}>
                        Pobierz bilet
                      </Button>
                      <Button variant="secondary" onClick={handleBackToHome}>
                        Strona główna
                      </Button>
                    </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
    );
}
