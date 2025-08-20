import { useEffect, useState } from "react";
import "../assets/css/nosotros.css";
import Equipo from "./Equipo";

const Nosotros = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/nosotros");
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([data]);
        }
      } catch (error) {
        console.error("Error cargando datos de Nosotros:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="nosotros section" id="nosotros">
      {items.map((item) => (
        <div key={item.id} className="card-us">
          <div className="card-title">
            <h2>{item.titulo}</h2>
          </div>
          <div className="row-us">
            <div className="img-us">
              {item.url && (
                <img
                  src={`http://localhost:5000${item.url}`}
                  alt={item.titulo}
                  className="card-img"
                />
              )}
            </div>
            <div className="card-body">
              {/* Renderizamos el HTML guardado en la DB */}
              <p
                className="card-text"
                dangerouslySetInnerHTML={{ __html: item.descripcion }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* El componente Equipo se mantiene al final como en el diseño original */}
      <Equipo />
    </div>
  );
};

export default Nosotros;
