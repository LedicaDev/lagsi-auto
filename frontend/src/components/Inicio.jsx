// frontend/src/components/Inicio.jsx
import { useEffect, useState } from "react";
import "../assets/css/inicio.css";
import "../assets/css/navbar.css";
import "../assets/css/slideshow.css";
import "../assets/css/testimonios.css";
import "../assets/css/nosotros.css";

// ✅ Importar componentes
import Nosotros from "./Nosotros";
import Testimonios from "./Testimonios";
import Servicios from "./Servicios";

const Inicio = () => {
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState(""); // ← url completa para el background
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    // Cargar datos de la sección Inicio (descripcion + imagen_url)
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => {
        setDescription(data.descripcion || "");
        setHeroImage(
          data.imagen_url ? `http://localhost:5000${data.imagen_url}` : ""
        );
      })
      .catch((err) => console.error("Error cargando inicio:", err));

    // Cargar slideshow
    fetch("http://localhost:5000/api/slideshow")
      .then((res) => res.json())
      .then((data) => {
        // 👇 importante: aquí data ya es un array de imágenes
        setSlideshowImages(
          data.map((img) => ({
            ...img,
            imagen_url: img.imagen_url
              ? `http://localhost:5000${img.imagen_url}`
              : "",
          }))
        );
      })
      .catch((err) => console.error("Error cargando slideshow:", err));

    // Cargar testimonios
    fetch("http://localhost:5000/api/testimonios")
      .then((res) => res.json())
      .then((data) => setTestimonios(data))
      .catch((err) => console.error("Error cargando testimonios:", err));
  }, []);

  // Slider (igual que antes)
  useEffect(() => {
    const slider = document.querySelector("#slider");
    let intervalId;

    const moveNext = () => {
      const first = document.querySelectorAll(".slider-section")[0];
      if (!slider || !first) return;
      slider.style.transition = "all 0.5s";
      slider.style.marginLeft = "-200%";
      setTimeout(() => {
        slider.style.transition = "none";
        slider.insertAdjacentElement("beforeend", first);
        slider.style.marginLeft = "-100%";
      }, 500);
    };

    const movePrev = () => {
      const sections = document.querySelectorAll(".slider-section");
      const last = sections[sections.length - 1];
      if (!slider || !last) return;
      slider.style.transition = "all 0.5s";
      slider.style.marginLeft = "0";
      setTimeout(() => {
        slider.style.transition = "none";
        slider.insertAdjacentElement("afterbegin", last);
        slider.style.marginLeft = "-100%";
      }, 500);
    };

    setTimeout(() => {
      const btnRight = document.getElementById("slider__btn--right");
      const btnLeft = document.getElementById("slider__btn--left");
      if (btnRight && btnLeft && slider) {
        btnRight.addEventListener("click", moveNext);
        btnLeft.addEventListener("click", movePrev);
        intervalId = setInterval(moveNext, 5000);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [slideshowImages]);

  return (
    <>
      {/* ✅ Hero Section */}
      <div className="inicio section" id="inicio">
        <div
          className="home-background"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : {}}
        />
      </div>

      <div className="home-description">
        <h2>
          Somos Consultores especialistas en análisis de Riesgo patrimonial.
        </h2>
        <br />
        <i>{description}</i>
      </div>

      {/* ✅ Slideshow */}
      <div className="slide-title">
        <h2>Testimonios</h2>
      </div>
      <div className="slide-container">
        <div className="slider" id="slider">
          {slideshowImages.map((img, index) => (
            <div className="slider-section" key={index}>
              <img
                className="slider__img"
                src={`http://localhost:5000${img.url}`} // ✅ ajustado
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className="slider__btn slider__btn--left" id="slider__btn--left">
          <i className="fa-solid fa-caret-left fa-2xl"></i>
        </div>
        <div className="slider__btn slider__btn--right" id="slider__btn--right">
          <i className="fa-solid fa-caret-right fa-2xl"></i>
        </div>
      </div>

      {/* ✅ Sección de Videos Testimoniales */}
      <Testimonios testimonios={testimonios} />

      {/* ✅ Sección Nosotros */}
      <Nosotros />
      <Servicios />
    </>
  );
};

export default Inicio;
