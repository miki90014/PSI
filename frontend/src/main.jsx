import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EmployeePanel } from "./EmployeePanel.jsx";
import { Login } from "./Login.jsx";
import { Home } from "./Home.jsx";
import { MovieDetails } from "./MovieDetails.jsx";
import { Register } from "./Register.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';


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
        <Route path="/">
          <Route index element={<Home />} />
        </Route>
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  </StrictMode>
);
