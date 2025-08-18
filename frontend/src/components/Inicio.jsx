import { useEffect, useState } from "react";
import "../assets/css/inicio.css";

const Inicio = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.titulo || "");
        setDescription(data.descripcion || "");
        if (data.imagen_url) {
          setHeroImage(`http://localhost:5000${data.imagen_url}`);
        }
      })
      .catch((err) => console.error("Error cargando inicio:", err));
  }, []);

  return (
    <div className="inicio section" id="inicio">
      <div
        className="home-background"
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : {}}
      />
      <div className="home-description">
        <p>
          <h2>{title}</h2>
          <br />
          <br />
          <i>{description}</i>
        </p>
      </div>
    </div>
  );
};

export default Inicio;
