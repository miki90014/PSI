import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmployeePanel } from "./EmployeePanel.jsx";
import { Login } from "./Login.jsx";
import { Home } from "./Home.jsx";
import { Register } from "./Register.jsx";
import { UserData } from "./UserData.jsx";
import { ReservationsView } from "./ReservationsView.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="employee">
          <Route index element={<Login />} />
          <Route path="employee-panel" element={<EmployeePanel />} />
        </Route>
        <Route path="client">
          <Route index element={<Home />} />
          <Route path="login">
            <Route index element={<Login />} />
            <Route path="userdata" element={<UserData />} />
            <Route path="reservations" element={<ReservationsView />} />
          </Route>
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
