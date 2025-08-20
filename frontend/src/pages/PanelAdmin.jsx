import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Layout reutilizable
import DashboardLayout from "./DashboardLayout";
import "../assets/css/panelAdmin.css";

// Componentes individuales
import AdminInicio from "../components/AdminInicio";
import AdminSlideshow from "../components/AdminSlideshow";
import AdminTestimonios from "../components/AdminTestimonios";
import AdminNosotros from "../components/AdminNosotros";
// import AdminEquipo from "../components/AdminEquipo";
// import AdminServicios from "../components/AdminServicios";
// import AdminContacto from "../components/AdminContacto";
// import AdminUsuarios from "../components/AdminUsuarios";

export default function PanelAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Lee ?tab= del query string
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "admin-inicio";

  const [active, setActive] = useState(initialTab);

  useEffect(() => {
    setActive(initialTab);
  }, [initialTab]);

  const onMenuClick = useCallback(
    (key) => {
      setActive(key);
      // 👇 actualiza la URL para recordar la pestaña activa
      navigate(`/panel?tab=${key}`, { replace: true });
    },
    [navigate]
  );

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
      // case "admin-equipo":
      //   return <AdminEquipo />;
      // case "admin-servicios":
      //   return <AdminServicios />;
      // case "admin-contacto":
      //   return <AdminContacto />;
      // case "admin-usuarios":
      //   return <AdminUsuarios />;
      default:
        return <AdminInicio />;
    }
  };

  return (
    <DashboardLayout onLogout={onLogout} onMenuClick={onMenuClick}>
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
      <div className="content-body">{renderContent()}</div>
    </DashboardLayout>
  );
}
