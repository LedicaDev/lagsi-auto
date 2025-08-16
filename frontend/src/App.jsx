import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import PanelAdmin from "./pages/PanelAdmin";
import Inicio from "./components/Inicio";
import "./App.css";
import "./index.css";
import "./assets/css/navbar.css";
import Navbar from "./components/Navbar";

// Componente para rutas protegidas con cookie
function PrivateRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/checkAuth", {
          method: "GET",
          credentials: "include", // 👈 importante para enviar cookies
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  if (!authChecked) return <div>Cargando...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar siempre visible */}
      <Navbar />

      <Routes>
        {/* 👇 Si entras a "/", te manda a "/inicio" */}
        <Route path="/" element={<Navigate to="/inicio" />} />

        {/* Página pública Inicio */}
        <Route path="/inicio" element={<Inicio />} />

        {/* Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Página protegida */}
        <Route
          path="/panel"
          element={
            <PrivateRoute>
              <PanelAdmin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
