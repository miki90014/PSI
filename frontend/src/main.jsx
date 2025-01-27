import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { EmployeePanel } from "./EmployeePanel.jsx";
import { Login } from "./Login.jsx";
import { Home } from "./Home.jsx";
import { Register } from "./Register.jsx";
import { UserData } from "./UserData.jsx";
import { TicketsView } from "./TicketsView.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

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
            <Route path="userdata" element={<UserData accessToken={accessToken} />} />
            <Route path="reservations" element={<TicketsView accessToken={accessToken} />} />
          </Route>
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
