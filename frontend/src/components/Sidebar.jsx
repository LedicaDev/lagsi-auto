import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHome,
  faImages,
  faSignOutAlt,
  faTableCellsLarge,
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
            <FontAwesomeIcon icon={faTableCellsLarge} size="2x" />
          ) : (
            <h2>cPanel</h2>
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
