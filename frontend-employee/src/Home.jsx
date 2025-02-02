import React from 'react';
import NavBar from './NavBar'; // Importujemy komponent paska nawigacyjnego
import { Container, Row, Col, Card } from 'react-bootstrap'; // Importujemy komponenty Bootstrap

function Home() {
  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      {/* Pasek nawigacyjny */}
      <NavBar />

      {/* Główny kontener */}
      <Container fluid className="d-flex justify-content-center align-items-center flex-grow-1">
        <Row className="justify-content-center w-100">
          <Col md={8}>
            <Card className="text-center w-100">
              <Card.Body>
                <Card.Title>Witaj w panelu głównym po zalogowaniu!</Card.Title>
                <Card.Text>
                  Wybierz jedną z opcji na pasku nawigacyjnym, aby przejść do odpowiedniej sekcji.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
