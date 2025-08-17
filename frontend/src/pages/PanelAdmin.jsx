// frontend/src/pages/PanelAdmin.jsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Layout reutilizable
import DashboardLayout from "./DashboardLayout";
import "../assets/css/panelAdmin.css";

function AdminInicio() {
  return (
    <div>
      <h3>Gestión de Inicio</h3>
      <p>Contenido para editar el texto/hero del inicio.</p>
    </div>
  );
}

function AdminSlideshow() {
  return (
    <div>
      <h3>Gestión de Slideshow</h3>
      <p>Sube, ordena y elimina imágenes del carrusel.</p>
    </div>
  );
}

function AdminTestimonios() {
  return (
    <div>
      <h3>Gestión de Testimonios</h3>
      <p>Agrega o edita videos testimoniales (YouTube, etc.).</p>
    </div>
  );
}

function AdminNosotros() {
  return (
    <div>
      <h3>Gestión de Nosotros</h3>
      <p>Actualiza información del equipo y misión/visión.</p>
    </div>
  );
}

function AdminEquipo() {
  return (
    <div>
      <h3>Gestión de Equipo</h3>
      <p>Agrega o edita información sobre los miembros del equipo.</p>
    </div>
  );
}

function AdminServicios() {
  return (
    <div>
      <h3>Gestión de Servicios</h3>
      <p>Actualiza la lista de servicios ofrecidos.</p>
    </div>
  );
}

function AdminContacto() {
  return (
    <div>
      <h3>Gestión de Contacto</h3>
      <p>Actualiza la información de contacto y redes sociales.</p>
    </div>
  );
}

function AdminUsuarios() {
  return (
    <div>
      <h3>Gestión de Usuarios</h3>
      <p>Administra los usuarios registrados en la plataforma.</p>
    </div>
  );
}

export default function PanelAdmin() {
  const [active, setActive] = useState("admin-inicio");
  const navigate = useNavigate();

  const onMenuClick = useCallback((key) => setActive(key), []);

  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.error("Error en logout:", e?.response?.data || e.message);
    } finally {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
      navigate("/login");
    }
  }, [navigate]);

  const renderContent = () => {
    switch (active) {
      case "admin-inicio":
        return <AdminInicio />;

      case "admin-slideshow":
        return <AdminSlideshow />;

      case "admin-testimonios":
        return <AdminTestimonios />;

      case "admin-nosotros":
        return <AdminNosotros />;

      case "admin-equipo":
        return <AdminEquipo />;

      case "admin-servicios":
        return <AdminServicios />;

      case "admin-contacto":
        return <AdminContacto />;

      case "admin-usuarios":
        return <AdminUsuarios />;

      default:
        return <AdminInicio />;
    }
  };

  return (
    <DashboardLayout onLogout={onLogout} onMenuClick={onMenuClick}>
      {/* Header dinámico */}
      <div className="content-header">
        <h2>
          {active === "admin-inicio" && "Admin Inicio"}
          {active === "admin-slideshow" && "Admin Slideshow"}
          {active === "admin-testimonios" && "Admin Testimonios"}
          {active === "admin-nosotros" && "Admin Nosotros"}
          {active === "admin-equipo" && "Admin Equipo"}
          {active === "admin-servicios" && "Admin Servicios"}
          {active === "admin-contacto" && "Admin Contacto"}
          {active === "admin-usuarios" && "Admin Usuarios"}
        </h2>
      </div>

      {/* Contenido dinámico */}
      <div className="content-body">{renderContent()}</div>
    </DashboardLayout>
  );
}
