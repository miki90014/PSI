import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';  // Importujemy komponenty Bootstrap

function TicketChecking() {
  const [ticketCode, setTicketCode] = useState('');
  const [message, setMessage] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;

  const checkTicket = async () => {
    setMessage(null);

    if (!ticketCode.trim()) {
      setMessage({ type: 'error', text: 'Wpisz kod biletu!' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/check_ticket/${ticketCode}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Bilet zweryfikowany: ${data.success || data.details}` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Bilet jest nieważny lub nie istnieje.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd serwera. Spróbuj ponownie.' });
    }
  };

  return (
    <div className="ticket-checking-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="text-center mb-4">Sprawdzanie Biletów</h2>

      <Form>
        <Form.Group controlId="ticketCode">
          <Form.Label>Wpisz kod biletu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz kod biletu"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={checkTicket} block>
          Sprawdź bilet
        </Button>
      </Form>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="mt-3">
          {message.text}
        </Alert>
      )}
    </div>
  );
}

export default TicketChecking;
