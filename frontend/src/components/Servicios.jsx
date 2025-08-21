// frontend/src/components/Servicios.jsx
import { useEffect, useState } from "react";
import "../assets/css/servicios.css";

const Servicios = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  return (
    <section className="servicios" id="servicios">
      <div className="service-title">
        <h2 className="service-title-text">Nuestros Servicios</h2>
      </div>

      <div className="service-content">
        {servicios.length > 0 ? (
          servicios.map((srv) => (
            <div key={srv.id} className="card">
              {/* Imagen */}
              {srv.imagen_url && (
                <img
                  src={`http://localhost:5000${srv.imagen_url}`}
                  alt={srv.titulo}
                  className="card-image"
                />
              )}

              {/* Título y descripción */}
              <div className="srv-card-body">
                <h3 className="srv-card-body-title">{srv.titulo}</h3>
                <p>{srv.descripcion}</p>
              </div>

              {/* Links dinámicos */}
              <div className="srv-links">
                {srv.whatsapp_url && (
                  <a
                    href={srv.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp me
                  </a>
                )}
                {srv.contacto_url && <a href={srv.contacto_url}>Contacto</a>}
                {srv.reunion_url && (
                  <a href={srv.reunion_url}>Agendar una reunión</a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No hay servicios registrados
          </p>
        )}
      </div>
    </section>
  );
};

export default Servicios;
