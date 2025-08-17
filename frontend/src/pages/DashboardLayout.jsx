// frontend/src/pages/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import "../assets/css/dashboardLayout.css";

export default function DashboardLayout({ children, onLogout, onMenuClick }) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar siempre presente */}
      <Sidebar onLogout={onLogout} onMenuClick={onMenuClick} />

      {/* Contenido dinámico */}
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
