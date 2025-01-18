import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmployeePanel } from "./EmployeePanel.jsx";
import { Login } from "./Login.jsx";
import { Home } from "./Home.jsx";
import { Register } from "./Register.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="employee">
          <Route index element={<EmployeePanel />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="client">
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
