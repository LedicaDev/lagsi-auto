import { useState } from "react";
import "boxicons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faBars,
  faBriefcase,
  faHome,
  faImages,
  faPeopleGroup,
  faSignOutAlt,
  faUserPlus,
  faUsers,
  faVideo, // 👈 Importado correctamente
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/sidebar.css";

const Sidebar = ({ onLogout, onMenuClick }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
      <aside className={`sidebar`}>
        <div className="sidebar-header">
          {collapsed ? (
            <i class="bx bxs-grid-alt"></i>
          ) : (
            <h2>
              <i class="bx bxs-grid-alt"></i>&nbsp; cPanel
            </h2>
          )}
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => onMenuClick("admin-inicio")}>
            <FontAwesomeIcon icon={faHome} />
            {!collapsed && <span>Admin Inicio</span>}
          </li>

          <li onClick={() => onMenuClick("admin-slideshow")}>
            <FontAwesomeIcon icon={faImages} />
            {!collapsed && <span>Admin Slideshow</span>}
          </li>

          <li onClick={() => onMenuClick("admin-testimonios")}>
            <FontAwesomeIcon icon={faVideo} />
            {!collapsed && <span>Admin Testimonios</span>}
          </li>

          <li onClick={() => onMenuClick("admin-nosotros")}>
            <FontAwesomeIcon icon={faUsers} />
            {!collapsed && <span>Admin Nosotros</span>}
          </li>
          <li onClick={() => onMenuClick("admin-equipo")}>
            <FontAwesomeIcon icon={faPeopleGroup} />
            {!collapsed && <span>Admin Equipo</span>}
          </li>
          <li onClick={() => onMenuClick("admin-servicios")}>
            <FontAwesomeIcon icon={faBriefcase} />
            {!collapsed && <span>Admin Servicios</span>}
          </li>
          <li onClick={() => onMenuClick("admin-contacto")}>
            <FontAwesomeIcon icon={faAt} />
            {!collapsed && <span>Admin Contacto</span>}
          </li>
          <li onClick={() => onMenuClick("admin-usuarios")}>
            <FontAwesomeIcon icon={faUserPlus} />
            {!collapsed && <span>Admin Usuarios</span>}
          </li>
          <li onClick={onLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!collapsed && <span>Cerrar sesión</span>}
          </li>
        </ul>
      </aside>

      <button
        className="toggle-btn"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default Sidebar;
