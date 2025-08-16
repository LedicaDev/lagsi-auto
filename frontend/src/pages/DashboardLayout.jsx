import Sidebar from "../components/Sidebar";
import "../assets/css/dashboardLayout.css";
import CopyRight from "../components/CopyRight";

const DashboardLayout = ({ children, onLogout, onMenuClick, usuario }) => {
  return (
    <div className="dashboard-layout">
      {/* Menú lateral */}
      <Sidebar
        onLogout={onLogout}
        onMenuClick={onMenuClick}
        usuario={usuario} // ✅ Pasamos usuario a Sidebar
      />

      {/* descripción principal */}
      <div className="dashboard-main">{children}</div>
    </div>
  );
};

export default DashboardLayout;
