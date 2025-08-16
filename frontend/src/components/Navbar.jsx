// src/components/Navbar.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 👈 nuevo
import useWindowWidth from "../hooks/useWindowWidth";
import "../assets/css/navbar.css";

export default function Navbar() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const navigate = useNavigate(); // 👈 nuevo
  const location = useLocation(); // 👈 opcional (para scroll suave)

  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState("");

  const loadNavbar = useCallback(async () => {
    try {
      const res = await fetch("/api/navbar");
      if (!res.ok) throw new Error("No se pudo cargar navbar");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setData({
        logo_url: "/logo-lagsi.png",
        items: [
          { text: "Inicio", href: "#inicio" },
          { text: "Nosotros", href: "#nosotros" },
          { text: "Servicios", href: "#servicios" },
          { text: "Contacto", href: "#contacto" },
        ],
        bg_color: "#ffffff",
      });
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadNavbar();
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("usuario");
    if (token && user) {
      const usuario = JSON.parse(user);
      setIsAuthenticated(true);
      setRol(usuario.rol);
    }
  }, [loadNavbar]);

  // (opcional) si ya estás en /inicio y cambia el hash, hace scroll suave
  useEffect(() => {
    if (location.pathname === "/inicio" && location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location]);

  if (!data) return null;

  const { logo_url: logoUrl, items, bg_color: bgColor } = data;

  // 👇 lógica de navegación para ítems
  const goTo = (e, href) => {
    e.preventDefault();
    if (isMobile) setOpen(false);

    if (href?.startsWith("#")) {
      // Siempre mandamos a /inicio cuando es una sección
      navigate(`/inicio${href}`);
    } else if (href === "/login" || href === "/panel") {
      // Rutas internas
      navigate(href);
    } else if (/^https?:\/\//i.test(href)) {
      // Enlace externo
      window.location.href = href;
    } else {
      // Cualquier otra ruta interna
      navigate(href || "/inicio");
    }
  };

  return (
    <>
      {/* ===== MÓVIL ===== */}
      {isMobile && (
        <div
          className={`mobile-menu ${open ? "open" : ""}`}
          style={{ backgroundColor: bgColor }}
        >
          <div className="sidebar-content">
            <div className="sidebar">
              <div className="sidebar-brand">
                <a href="https://www.lagsi.com.co">
                  <img className="image-logo" src={logoUrl} alt="logo" />
                </a>
              </div>

              <div className="sidebar-item">
                {items.map((i) => {
                  const resolvedHref = i.href?.startsWith("#")
                    ? `/inicio${i.href}`
                    : i.href || "/inicio";
                  return (
                    <a
                      key={i.text + i.href}
                      className="nav-item"
                      href={resolvedHref}
                      onClick={(e) => goTo(e, i.href)}
                    >
                      {i.text}
                    </a>
                  );
                })}

                {!isAuthenticated && (
                  <a
                    className="nav-item"
                    href="/login"
                    onClick={(e) => goTo(e, "/login")}
                  >
                    Login
                  </a>
                )}

                {isAuthenticated && rol === "admin" && (
                  <a
                    className="nav-item"
                    href="/panel"
                    onClick={(e) => goTo(e, "/panel")}
                  >
                    cPanel
                  </a>
                )}
              </div>
            </div>

            <div className="btn-content">
              <button
                className="btn-sidebar"
                onClick={() => setOpen((v) => !v)}
              >
                <i className="bx bx-menu" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ESCRITORIO ===== */}
      {!isMobile && (
        <div className="navbar-content" style={{ backgroundColor: bgColor }}>
          <div className="navbar">
            <div className="navbar-brand">
              <a href="https://www.lagsi.com.co">
                <img className="image-logo" src={logoUrl} alt="logo" />
              </a>
            </div>

            <div className="navbar-items">
              {items.map((i) => {
                const resolvedHref = i.href?.startsWith("#")
                  ? `/inicio${i.href}`
                  : i.href || "/inicio";
                return (
                  <a
                    key={i.text + i.href}
                    className="nav-item"
                    href={resolvedHref}
                    onClick={(e) => goTo(e, i.href)}
                  >
                    {i.text}
                  </a>
                );
              })}

              {!isAuthenticated && (
                <a
                  className="nav-item"
                  href="/login"
                  onClick={(e) => goTo(e, "/login")}
                >
                  Login
                </a>
              )}

              {isAuthenticated && rol === "admin" && (
                <a
                  className="nav-item"
                  href="/panel"
                  onClick={(e) => goTo(e, "/panel")}
                >
                  cPanel
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
