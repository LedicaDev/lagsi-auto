// frontend/src/pages/PanelAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PanelAdmin() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/me", { withCredentials: true })
      .then((res) => setUsuario(res.data.usuario))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:5000/api/logout",
      {},
      { withCredentials: true }
    );
    navigate("/login");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <p>Rol: {usuario.rol}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
}
