import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export function ReservationFinalization() {
  const location = useLocation();
  const { showID } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  // Pobranie danych z URL
  const date = queryParams.get("date");
  const price = parseFloat(queryParams.get("price"));
  const form = queryParams.get("form");
  const title = queryParams.get("movieTitle");
  const cinemaName = queryParams.get("cinemaName");
  const selectedSeats = queryParams.get("selectedSeats") ? queryParams.get("selectedSeats").split(",").map(Number) : [];
  const selectedSeatsNames = queryParams.get("selectedSeatsNames");

  console.log(selectedSeatsNames);

  // Stan dla metod płatności
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;

  // Stan formularza
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "1", // Domyślnie pierwsza metoda płatności
    showID: showID,
    selectedSeats: selectedSeats,
    price: selectedSeats.length * price,
  });

  // Pobranie metod płatności
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${API_BASE_CUSTOMER_URL}/payment_services`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment methods");
        }
        const data = await response.json();
        setPayments(data);
        // Ustaw domyślną metodę płatności
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, paymentMethod: String(data[0].ID) }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethods();
  }, [showID]);

  // Obsługa zmiany w formularzu
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Obsługa zmiany metody płatności
  const handlePaymentChange = (e) => {
    setFormData({ ...formData, paymentMethod: e.target.value });
  };

  // Obsługa wysyłki formularza
  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegamy odświeżeniu strony

    try {
      const response = await fetch(`${API_BASE_CUSTOMER_URL}/buy_ticket/${showID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate(
          `/ticket-summary/${data.reservationID}?date=${date}&form=${form}&movieTitle=${title}&cinemaName=${cinemaName}&selectedSeatsNames=${selectedSeatsNames}&email=${formData.email}&price=${price}`
        );
      } else {
        alert(`Błąd: ${data.message}`);
      }
    } catch (error) {
      alert("Wystąpił błąd podczas zakupu biletu.");
      console.error(error);
    }
  };

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
      <Row className="bg-light p-4 rounded shadow">
        {/* Formularz danych osobowych */}
        <Col md={6}>
          <h3 className="my-4 text-center">Dane Osobowe</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Imię</Form.Label>
              <Form.Control type="text" name="firstName" placeholder="Wpisz imię" value={formData.firstName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control type="text" name="lastName" placeholder="Wpisz nazwisko" value={formData.lastName} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Wpisz email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Numer telefonu</Form.Label>
              <Form.Control type="tel" name="phone" placeholder="Wpisz numer telefonu" value={formData.phone} onChange={handleChange} required />
            </Form.Group>

            {/* Wybór metody płatności */}
            <h5 className="mt-4">Wybierz metodę płatności:</h5>
            <Form.Group className="mb-3">
              {payments.map((payment) => (
                <Form.Check
                  key={payment.ID}
                  type="radio"
                  label={payment.name}
                  name="paymentMethod"
                  value={payment.ID}
                  checked={formData.paymentMethod === String(payment.ID)}
                  onChange={handlePaymentChange}
                />
              ))}
            </Form.Group>

            {/* Przycisk wysyłania formularza */}
            <Button variant="primary" type="submit">
              Zakup bilety
            </Button>
          </Form>
        </Col>

        <Col md={1}></Col>

        {/* Podsumowanie */}
        <Col md={3}>
          <h3 className="my-4 text-center">Podsumowanie</h3>
          {selectedSeats.length > 0 && (
            <div className="mt-3">
              <strong>Film: </strong> {title}
              <br />
              <strong>Forma filmu: </strong> {form}
              <br />
              <strong>Kino: </strong> {cinemaName}
              <br />
              <strong>Miejsca: </strong> {selectedSeatsNames}
              <br />
              <strong>Cena za bilet: </strong> {price} PLN
              <br />
              <strong>Całkowita cena: </strong> {selectedSeats.length * price} PLN
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
