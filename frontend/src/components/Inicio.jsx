/* import { useEffect, useState } from "react";
import "../assets/css/inicio.css";
import "../assets/css/navbar.css";
import "../assets/css/slideshow.css";
import "../assets/css/enlaces.css";

const Inicio = () => {
  const [description, setDescription] = useState("");
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [enlaces, setEnlaces] = useState([]);

  useEffect(() => {
    // Cargar descripción
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => setDescription(data.description))
      .catch((err) => console.error("Error cargando descripción:", err));

    // Cargar imágenes del slideshow
    fetch("http://localhost:5000/api/slideshow")
      .then((res) => res.json())
      .then((data) => setSlideshowImages(data))
      .catch((err) => console.error("Error cargando slideshow:", err));

    // Cargar enlaces
    fetch("http://localhost:5000/api/enlaces")
      .then((res) => res.json())
      .then((data) => setEnlaces(data))
      .catch((err) => console.error("Error cargando enlaces:", err));
  }, []);

  // Lógica de slider
  useEffect(() => {
    const slider = document.querySelector("#slider");
    let intervalId;

    const moveNext = () => {
      const first = document.querySelectorAll(".slider-section")[0];
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
      <div className="inicio section" id="inicio">
        <div className="home-background"></div>
      </div>

      <div className="home-description">
        <h2>
          Somos Consultores especialistas en análisis de Riesgo patrimonial.
        </h2>
        <br />
        <i>{description}</i>
      </div>

      <div className="slide-title">
        <h2>Testimonios</h2>
      </div>
      <div className="slide-container">
        <div className="slider" id="slider">
          {slideshowImages.map((img, index) => (
            <div className="slider-section" key={index}>
              <img
                className="slider__img"
                src={img.url}
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

      <div className="link-content">
        {enlaces.map((enlace, index) => (
          <div className="link-item" key={index}>
            <a href={enlace.href}>
              <div className="link">
                <img
                  className="icon-service"
                  src={enlace.icono}
                  alt={enlace.titulo}
                />
                <span className="link-title">{enlace.titulo}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Inicio;
 */

/* import { useEffect, useState } from "react";
import "../assets/css/inicio.css";
import "../assets/css/navbar.css";
import "../assets/css/slideshow.css";
import "../assets/css/enlaces.css";

const Inicio = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [slideshowImages, setSlideshowImages] = useState([]);
  const [enlaces, setEnlaces] = useState([]);

  useEffect(() => {
    // Cargar datos de inicio
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => {
        setTitulo(data.titulo || "");
        setDescripcion(data.descripcion || "");
      })
      .catch((err) => console.error("Error cargando inicio:", err));

    // Cargar imágenes del slideshow
    fetch("http://localhost:5000/api/slideshow")
      .then((res) => res.json())
      .then((data) =>
        setSlideshowImages(
          data.map((img) => ({
            ...img,
            url: `http://localhost:5000${img.url}`,
          }))
        )
      )
      .catch((err) => console.error("Error cargando slideshow:", err));

    // Cargar enlaces
    fetch("http://localhost:5000/api/enlaces")
      .then((res) => res.json())
      .then((data) => setEnlaces(data))
      .catch((err) => console.error("Error cargando enlaces:", err));
  }, []);

  // Lógica de slider
  useEffect(() => {
    if (slideshowImages.length === 0) return;

    const slider = document.querySelector("#slider");
    let intervalId;

    const moveNext = () => {
      const first = document.querySelectorAll(".slider-section")[0];
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
      slider.style.transition = "all 0.5s";
      slider.style.marginLeft = "0";
      setTimeout(() => {
        slider.style.transition = "none";
        slider.insertAdjacentElement("afterbegin", last);
        slider.style.marginLeft = "-100%";
      }, 500);
    };

    const btnRight = document.getElementById("slider__btn--right");
    const btnLeft = document.getElementById("slider__btn--left");

    btnRight?.addEventListener("click", moveNext);
    btnLeft?.addEventListener("click", movePrev);

    intervalId = setInterval(moveNext, 5000);

    return () => {
      btnRight?.removeEventListener("click", moveNext);
      btnLeft?.removeEventListener("click", movePrev);
      clearInterval(intervalId);
    };
  }, [slideshowImages]);

  return (
    <>
      <div className="inicio section" id="inicio">
        <div className="home-background"></div>
      </div>

      <div className="home-description">
        <h2>{titulo}</h2>
        <br />
        <i>{descripcion}</i>
      </div>

      <div className="slide-title">
        <h2>Testimonios</h2>
      </div>
      <div className="slide-container">
        <div className="slider" id="slider">
          {slideshowImages.map((img, index) => (
            <div className="slider-section" key={index}>
              <img
                className="slider__img"
                src={img.url}
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

      <div className="link-content">
        {enlaces.map((enlace, index) => (
          <div className="link-item" key={index}>
            <a href={enlace.href}>
              <div className="link">
                <img
                  className="icon-service"
                  src={enlace.icono}
                  alt={enlace.titulo}
                />
                <span className="link-title">{enlace.titulo}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Inicio; */
import { useEffect, useState } from "react";
import "../assets/css/inicio.css";
import "../assets/css/navbar.css";
import "../assets/css/slideshow.css";
import "../assets/css/testimonios.css";
import Navbar from "./Navbar";

const Inicio = () => {
  const [description, setDescription] = useState("");
  const [slideshowImages, setSlideshowImages] = useState([]);

  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inicio")
      .then((res) => res.json())
      .then((data) => setDescription(data.descripcion))
      .catch((err) => console.error("Error cargando descripción:", err));

    fetch("http://localhost:5000/api/slideshow")
      .then((res) => res.json())
      .then((data) => setSlideshowImages(data))
      .catch((err) => console.error("Error cargando slideshow:", err));

    fetch("http://localhost:5000/api/testimonios")
      .then((res) => res.json())
      .then((data) => setTestimonios(data))
      .catch((err) => console.error("Error cargando testimonios:", err));
  }, []);

  // Slider
  useEffect(() => {
    const slider = document.querySelector("#slider");
    let intervalId;

    const moveNext = () => {
      const first = document.querySelectorAll(".slider-section")[0];
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
      <div className="inicio section" id="inicio">
        <div className="home-background"></div>
      </div>

      <div className="home-description">
        <h2>
          Somos Consultores especialistas en análisis de Riesgo patrimonial.
        </h2>
        <br />
        <i>{description}</i>
      </div>

      {/* Slideshow */}
      <div className="slide-title">
        <h2>Testimonios</h2>
      </div>
      <div className="slide-container">
        <div className="slider" id="slider">
          {slideshowImages.map((img, index) => (
            <div className="slider-section" key={index}>
              <img
                className="slider__img"
                src={img.url}
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

      {/* Videos testimonios */}
      <div className="slide-title">
        <h2>Video testimoniales</h2>
      </div>
      {testimonios.length > 0 && (
        <div className="testimonios-container">
          {testimonios.map((video) => (
            <div className="testimonio" key={video.id}>
              <iframe
                src={video.url}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Inicio;
