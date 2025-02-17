import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { EmployeePanel } from "./EmployeePanel.jsx";
import { Login } from "./Login.jsx";
import { Home } from "./Home.jsx";
import { MovieReservation } from "./MovieReservation.jsx";
import { MovieDetails } from "./MovieDetails.jsx";
import { ReservationFinalization } from "./ReservationFinalization.jsx";
import { TicketSummary } from "./TicketSummary.jsx";
import { Register } from "./Register.jsx";
import { UserData } from "./UserData.jsx";
import { TicketsView } from "./TicketsView.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllInOne.css";
import { Protected } from "./Protected.jsx";

function Main() {
  const [accessToken, setAccessToken] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="employee">
          <Route index element={<Login setAccessToken={setAccessToken} />} />
          <Route path="employee-panel" element={<EmployeePanel />} />
        </Route>
        <Route path="client">
          <Route index element={<Home />} />
          <Route path="login">
            <Route index element={<Login setAccessToken={setAccessToken} />} />
            <Route
              path="userdata"
              element={
                <Protected accessToken={accessToken}>
                  <UserData accessToken={accessToken} setAccessToken={setAccessToken} />
                </Protected>
              }
            />
            <Route
              path="reservations"
              element={
                <Protected accessToken={accessToken}>
                  <TicketsView setAccessToken={setAccessToken} />
                </Protected>
              }
            />
          </Route>
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/">
          <Route index element={<Home />} />
        </Route>
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie-reservation/:showID" element={<MovieReservation />} />
        <Route path="/reservation-finalization/:showID" element={<ReservationFinalization />} />
        <Route path="/ticket-summary/:reservationID" element={<TicketSummary />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
