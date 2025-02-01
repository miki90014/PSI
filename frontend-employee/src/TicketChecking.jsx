import React, { useState } from 'react';

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
      const response = await fetch(`${API_BASE_URL}/check-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Bilet ważny: ${data.details}` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Bilet jest nieważny lub nie istnieje.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd serwera. Spróbuj ponownie.' });
    }
  };

  return (
    <div className="ticket-checking-container">
      <h2>Sprawdzanie Biletów</h2>
      <input
        type="text"
        placeholder="Wpisz kod biletu"
        value={ticketCode}
        onChange={(e) => setTicketCode(e.target.value)}
      />
      <button onClick={checkTicket}>Sprawdź bilet</button>

      {message && (
        <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default TicketChecking;
