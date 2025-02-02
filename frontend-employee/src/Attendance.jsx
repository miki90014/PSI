import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Dropdown } from 'react-bootstrap';

const API_CUSTOMER_URL = import.meta.env.VITE_APP_API_CUSTOMER_BASE_URL;
const API_EMPLOYEE_URL = import.meta.env.VITE_APP_API_EMPLOYEE_BASE_URL;

function Attendance() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState([]);
  const [cinemas, setCinemas] = useState({});

  useEffect(() => {
    fetch(`${API_EMPLOYEE_URL}/movies`)
      .then(response => response.json())
      .then(data => setMovies(data));
  }, []);

  useEffect(() => {
    if (!selectedMovie) return;

    fetch(`${API_CUSTOMER_URL}/showings/attendance/${selectedMovie}`)
      .then(response => response.json())
      .then(async showings => {
        let cinemaMap = {};  // Mapa dla kin
        let formattedData = [];

        console.log(showings);

        for (let showing of showings) {
            const { Attandance, Date, ID, RoomID } = showing;
            console.log(`Showing ID: ${ID}, Date: ${Date}, Room: ${RoomID}, Attendance: ${Attandance}`);

          const cinemaResponse = await fetch(`${API_EMPLOYEE_URL}/room/${RoomID}/cinema`);
          const cinemaData = await cinemaResponse.json();

          if (!cinemaMap[cinemaData.ID]) {
            cinemaMap[cinemaData.ID] = {
              name: cinemaData.name,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              attendance: [],  // Zmieniamy na tablicę
              count: 0
            };
          }

          cinemaMap[cinemaData.ID].attendance.push(parseFloat(Attandance) || 0);  // Przechowujemy każde seansowe wartości
          cinemaMap[cinemaData.ID].count++;

          let existingEntry = formattedData.find(entry => entry.date === Date);
          if (!existingEntry) {
            existingEntry = { date: Date };
            formattedData.push(existingEntry);
          }
          existingEntry[`cinema_${cinemaData.ID}`] = parseFloat(Attandance) || 0;
        }

        setCinemas(cinemaMap);
        setData(formattedData);
        console.log(data)
      });
  }, [selectedMovie]);

  return (
    <div className="container p-4">
      <h2 className="text-center mb-4">Analiza Frekwencji</h2>
      
      <div className="d-flex justify-content-between mb-4">
        <Dropdown onSelect={(eventKey) => setSelectedMovie(eventKey)}>
          <Dropdown.Toggle variant="primary">
            {selectedMovie
              ? movies.find(movie => movie.ID.toString() === selectedMovie)?.title || "Wybierz film"
              : "Wybierz film"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {movies.map((movie) => (
              <Dropdown.Item key={movie.ID} eventKey={movie.ID.toString()}>
                {movie.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="success" onClick={() => alert('Eksportowanie danych...')}>
          Eksportuj
        </Button>
      </div>

      {selectedMovie && (
        <div className="bg-white p-4 rounded shadow-lg" style={{ height: '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(tick) => new Date(tick).toLocaleString()}
                />
              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              <Legend />
              {Object.entries(cinemas).map(([cinemaID, { name, color }]) => (
                <Bar key={cinemaID} dataKey={`cinema_${cinemaID}`} name={name} fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Attendance;
