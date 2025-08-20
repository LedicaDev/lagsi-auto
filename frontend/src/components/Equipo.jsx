import { useEffect, useState } from "react";
import "../assets/css/equipo.css";

const Equipo = () => {
  const [miembros, setMiembros] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/equipo")
      .then((res) => res.json())
      .then((data) =>
        setMiembros(
          data.map((m) => ({
            ...m,
            imagen_url: m.imagen_url
              ? `http://localhost:5000${m.imagen_url}`
              : null,
          }))
        )
      )
      .catch((err) => console.error("Error al cargar equipo:", err));
  }, []);

  return (
    <article>
      <div className="team-title">
        <span>Nuestro Equipo</span>
      </div>

      <div className="teams-content">
        {miembros.length > 0 ? (
          miembros
            .filter((m) => m.visible === 1) // 👈 mostrar solo los que están activos
            .sort((a, b) => a.orden - b.orden) // 👈 respetar el orden definido en DB
            .map((m) => (
              <div key={m.id} className="team-item">
                {m.imagen_url && (
                  <img
                    src={m.imagen_url}
                    alt={m.nombre}
                    className="team-image"
                  />
                )}
                <h2 className="team-name">{m.nombre}</h2>
                <span>{m.cargo}</span>
                <span className="span-2">{m.descripcion}</span>
              </div>
            ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No hay miembros registrados
          </p>
        )}
      </div>
    </article>
  );
};

export default Equipo;
