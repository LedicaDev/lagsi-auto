import { useEffect, useState } from "react";
import "../assets/css/slideshow.css";
import axios from "axios";

const Slideshow = () => {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/slideshow")
      .then((res) => {
        setImagenes(res.data);
      })
      .catch((err) => console.error("Error cargando imágenes:", err));
  }, []);

  useEffect(() => {
    if (imagenes.length === 0) return;

    const slider = document.querySelector("#slider");
    let sliderSections = document.querySelectorAll(".slider-section");
    let sliderSectionLast = sliderSections[sliderSections.length - 1];

    const btnLeft = document.querySelector("#slider__btn--left");
    const btnRight = document.querySelector("#slider__btn--right");

    slider.insertAdjacentElement("afterbegin", sliderSectionLast);

    function next() {
      let sliderSectionFirst = document.querySelectorAll(".slider-section")[0];
      slider.style.transition = "all 0.5s";
      slider.style.marginLeft = "-200%";
      setTimeout(function () {
        slider.style.transition = "none";
        slider.insertAdjacentElement("beforeend", sliderSectionFirst);
        slider.style.marginLeft = "-100%";
      }, 500);
    }

    function prev() {
      let sliderSections = document.querySelectorAll(".slider-section");
      let sliderSectionLast = sliderSections[sliderSections.length - 1];
      slider.style.transition = "all 0.5s";
      slider.style.marginLeft = "0";
      setTimeout(function () {
        slider.style.transition = "none";
        slider.insertAdjacentElement("afterbegin", sliderSectionLast);
        slider.style.marginLeft = "-100%";
      }, 500);
    }

    btnRight.addEventListener("click", next);
    btnLeft.addEventListener("click", prev);

    const intervalId = setInterval(next, 5000);

    return () => {
      btnRight.removeEventListener("click", next);
      btnLeft.removeEventListener("click", prev);
      clearInterval(intervalId);
    };
  }, [imagenes]);

  return (
    <>
      <div className="slide-title">
        <h2>Testimonios</h2>
      </div>
      <div className="slide-container">
        <div
          className="slider"
          id="slider"
          style={{ width: `${imagenes.length * 100}%` }}
        >
          {imagenes.map((img, index) => (
            <div className="slider-section" key={index}>
              <img
                src={`http://localhost:5000${img.url}`}
                alt={`Slide ${index}`}
                className="slider__img"
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
    </>
  );
};

export default Slideshow;
